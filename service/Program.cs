using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using TaskManagerAPI.Data;
using TaskManagerAPI.Models;
using TaskManagerAPI.Services;
using System.Security.Claims;

var builder = WebApplication.CreateBuilder(args);

builder.Services.ConfigureHttpJsonOptions(options =>
{
    options.SerializerOptions.ReferenceHandler = System.Text.Json.Serialization.ReferenceHandler.IgnoreCycles;
});

// Add services
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Add DbContext (in-memory)
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseInMemoryDatabase("TaskManagerDb"));

// Add JWT Authentication
var jwtKey = Encoding.ASCII.GetBytes(JwtService.GetSecretKey());
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(jwtKey),
        ValidateIssuer = false,
        ValidateAudience = false,
        ClockSkew = TimeSpan.Zero
    };
});

builder.Services.AddAuthorization();

// Add Services
builder.Services.AddScoped<JwtService>();
builder.Services.AddScoped<SmartSchedulerService>();

// Configure CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader();
    });
});

var app = builder.Build();

// Middleware
app.UseSwagger();
app.UseSwaggerUI();
app.UseCors("AllowAll");
app.UseAuthentication();
app.UseAuthorization();

// In-memory storage for Assignment 1 (keep for backward compatibility)
var tasks = new List<TaskItem>();
var nextId = 1;

// ===== ASSIGNMENT 1 ENDPOINTS (UNCHANGED) =====

app.MapGet("/api/tasks", () => Results.Ok(tasks))
    .WithName("GetTasks")
    .WithOpenApi();

app.MapGet("/api/tasks/{id}", (int id) =>
{
    var task = tasks.FirstOrDefault(t => t.Id == id);
    return task is not null ? Results.Ok(task) : Results.NotFound();
})
.WithName("GetTaskById")
.WithOpenApi();

app.MapPost("/api/tasks", (CreateTaskDto dto) =>
{
    if (string.IsNullOrWhiteSpace(dto.Description))
        return Results.BadRequest("Description is required");

    var newTask = new TaskItem
    {
        Id = nextId++,
        Description = dto.Description,
        IsCompleted = false,
        CreatedAt = DateTime.Now
    };

    tasks.Add(newTask);
    return Results.Created($"/api/tasks/{newTask.Id}", newTask);
})
.WithName("CreateTask")
.WithOpenApi();

app.MapPut("/api/tasks/{id}", (int id, UpdateTaskDto dto) =>
{
    var task = tasks.FirstOrDefault(t => t.Id == id);
    if (task is null) return Results.NotFound();
    if (string.IsNullOrWhiteSpace(dto.Description))
        return Results.BadRequest("Description is required");

    task.Description = dto.Description;
    task.IsCompleted = dto.IsCompleted;
    return Results.Ok(task);
})
.WithName("UpdateTask")
.WithOpenApi();

app.MapDelete("/api/tasks/{id}", (int id) =>
{
    var task = tasks.FirstOrDefault(t => t.Id == id);
    if (task is null) return Results.NotFound();
    tasks.Remove(task);
    return Results.NoContent();
})
.WithName("DeleteTask")
.WithOpenApi();

// ===== ASSIGNMENT 2: AUTHENTICATION ENDPOINTS =====

app.MapPost("/api/auth/register", async (RegisterDto dto, AppDbContext db, JwtService jwtService) =>
{
    // Check if user exists
    if (await db.Users.AnyAsync(u => u.Email == dto.Email))
        return Results.BadRequest("User already exists");

    // Hash password (simple hash for demo - use BCrypt in production)
    var hashedPassword = Convert.ToBase64String(
        System.Security.Cryptography.SHA256.HashData(
            Encoding.UTF8.GetBytes(dto.Password)));

    var user = new User
    {
        Email = dto.Email,
        Password = hashedPassword,
        CreatedAt = DateTime.Now
    };

    db.Users.Add(user);
    await db.SaveChangesAsync();

    var token = jwtService.GenerateToken(user.Id, user.Email);
    return Results.Ok(new { token, userId = user.Id, email = user.Email });
})
.WithName("Register")
.WithOpenApi();

app.MapPost("/api/auth/login", async (LoginDto dto, AppDbContext db, JwtService jwtService) =>
{
    var hashedPassword = Convert.ToBase64String(
        System.Security.Cryptography.SHA256.HashData(
            Encoding.UTF8.GetBytes(dto.Password)));

    var user = await db.Users.FirstOrDefaultAsync(u =>
        u.Email == dto.Email && u.Password == hashedPassword);

    if (user is null)
        return Results.Unauthorized();

    var token = jwtService.GenerateToken(user.Id, user.Email);
    return Results.Ok(new { token, userId = user.Id, email = user.Email });
})
.WithName("Login")
.WithOpenApi();

// ===== ASSIGNMENT 2: PROJECT ENDPOINTS =====

app.MapGet("/api/projects", async (AppDbContext db, ClaimsPrincipal user) =>
{
    var userId = int.Parse(user.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
    var projects = await db.Projects
        .Where(p => p.UserId == userId)
        .Include(p => p.Tasks)
        .ToListAsync();
    return Results.Ok(projects);
})
.RequireAuthorization()
.WithName("GetProjects")
.WithOpenApi();

app.MapPost("/api/projects", async (CreateProjectDto dto, AppDbContext db, ClaimsPrincipal user) =>
{
    var userId = int.Parse(user.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");

    var project = new Project
    {
        Title = dto.Title,
        Description = dto.Description,
        UserId = userId,
        CreatedAt = DateTime.Now
    };

    db.Projects.Add(project);
    await db.SaveChangesAsync();

    return Results.Created($"/api/projects/{project.Id}", project);
})
.RequireAuthorization()
.WithName("CreateProject")
.WithOpenApi();

app.MapDelete("/api/projects/{id}", async (int id, AppDbContext db, ClaimsPrincipal user) =>
{
    var userId = int.Parse(user.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
    var project = await db.Projects.FirstOrDefaultAsync(p => p.Id == id && p.UserId == userId);

    if (project is null) return Results.NotFound();

    db.Projects.Remove(project);
    await db.SaveChangesAsync();
    return Results.NoContent();
})
.RequireAuthorization()
.WithName("DeleteProject")
.WithOpenApi();

// ===== ASSIGNMENT 2: TASK ENDPOINTS =====

app.MapGet("/api/projects/{projectId}/tasks", async (int projectId, AppDbContext db, ClaimsPrincipal user) =>
{
    var userId = int.Parse(user.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
    var project = await db.Projects.FirstOrDefaultAsync(p => p.Id == projectId && p.UserId == userId);

    if (project is null) return Results.NotFound();

    var tasks = await db.ProjectTasks.Where(t => t.ProjectId == projectId).ToListAsync();
    return Results.Ok(tasks);
})
.RequireAuthorization()
.WithName("GetProjectTasks")
.WithOpenApi();

app.MapPost("/api/projects/{projectId}/tasks", async (int projectId, CreateProjectTaskDto dto, AppDbContext db, ClaimsPrincipal user) =>
{
    var userId = int.Parse(user.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
    var project = await db.Projects.FirstOrDefaultAsync(p => p.Id == projectId && p.UserId == userId);

    if (project is null) return Results.NotFound();

    var task = new ProjectTask
    {
        Title = dto.Title,
        DueDate = dto.DueDate,
        IsCompleted = false,
        ProjectId = projectId,
        CreatedAt = DateTime.Now
    };

    db.ProjectTasks.Add(task);
    await db.SaveChangesAsync();

    return Results.Created($"/api/projects/{projectId}/tasks/{task.Id}", task);
})
.RequireAuthorization()
.WithName("CreateProjectTask")
.WithOpenApi();

app.MapPut("/api/tasks/{id}", async (int id, UpdateProjectTaskDto dto, AppDbContext db, ClaimsPrincipal user) =>
{
    var userId = int.Parse(user.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
    var task = await db.ProjectTasks
        .Include(t => t.Project)
        .FirstOrDefaultAsync(t => t.Id == id && t.Project.UserId == userId);

    if (task is null) return Results.NotFound();

    task.Title = dto.Title;
    task.DueDate = dto.DueDate;
    task.IsCompleted = dto.IsCompleted;

    await db.SaveChangesAsync();
    return Results.Ok(task);
})
.RequireAuthorization()
.WithName("UpdateProjectTask")
.WithOpenApi();

app.MapDelete("/api/tasks/{id}", async (int id, AppDbContext db, ClaimsPrincipal user) =>
{
    var userId = int.Parse(user.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
    var task = await db.ProjectTasks
        .Include(t => t.Project)
        .FirstOrDefaultAsync(t => t.Id == id && t.Project.UserId == userId);

    if (task is null) return Results.NotFound();

    db.ProjectTasks.Remove(task);
    await db.SaveChangesAsync();
    return Results.NoContent();
})
.RequireAuthorization()
.WithName("DeleteProjectTask")
.WithOpenApi();

// ===== ASSIGNMENT 3: SMART SCHEDULER =====

app.MapPost("/api/v1/projects/{projectId}/schedule", async (
    int projectId,
    ScheduleRequestDto dto,
    AppDbContext db,
    SmartSchedulerService scheduler,
    ClaimsPrincipal user) =>
{
    var userId = int.Parse(user.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
    var project = await db.Projects
        .Include(p => p.Tasks)
        .FirstOrDefaultAsync(p => p.Id == projectId && p.UserId == userId);

    if (project is null) return Results.NotFound();

    var schedule = scheduler.GenerateSchedule(
        project.Tasks,
        dto.AvailableHoursPerDay,
        dto.StartDate);

    return Results.Ok(schedule);
})
.RequireAuthorization()
.WithName("SmartScheduler")
.WithOpenApi();

// Run the app
var port = Environment.GetEnvironmentVariable("PORT") ?? "5000";
app.Run($"http://0.0.0.0:{port}");
