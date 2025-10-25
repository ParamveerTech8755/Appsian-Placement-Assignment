using TaskManagerAPI.Models;

var builder = WebApplication.CreateBuilder(args);

// Add services
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Configure CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll",
        policy =>
        {
            policy.AllowAnyOrigin()
                  .AllowAnyMethod()
                  .AllowAnyHeader();
        });
});

var app = builder.Build();

// In-memory storage
var tasks = new List<TaskItem>();
var nextId = 1;

// Configure middleware
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("AllowAll");

// API Endpoints

// GET: Get all tasks
app.MapGet("/api/tasks", () =>
{
    return Results.Ok(tasks);
})
.WithName("GetTasks")
.WithOpenApi();

// GET: Get task by ID
app.MapGet("/api/tasks/{id}", (int id) =>
{
    var task = tasks.FirstOrDefault(t => t.Id == id);
    return task is not null ? Results.Ok(task) : Results.NotFound();
})
.WithName("GetTaskById")
.WithOpenApi();

// POST: Create new task
app.MapPost("/api/tasks", (CreateTaskDto dto) =>
{
    if (string.IsNullOrWhiteSpace(dto.Description))
    {
        return Results.BadRequest("Description is required");
    }

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

// PUT: Update task
app.MapPut("/api/tasks/{id}", (int id, UpdateTaskDto dto) =>
{
    var task = tasks.FirstOrDefault(t => t.Id == id);
    if (task is null)
    {
        return Results.NotFound();
    }

    if (string.IsNullOrWhiteSpace(dto.Description))
    {
        return Results.BadRequest("Description is required");
    }

    task.Description = dto.Description;
    task.IsCompleted = dto.IsCompleted;

    return Results.Ok(task);
})
.WithName("UpdateTask")
.WithOpenApi();

// DELETE: Delete task
app.MapDelete("/api/tasks/{id}", (int id) =>
{
    var task = tasks.FirstOrDefault(t => t.Id == id);
    if (task is null)
    {
        return Results.NotFound();
    }

    tasks.Remove(task);
    return Results.NoContent();
})
.WithName("DeleteTask")
.WithOpenApi();

var port = Environment.GetEnvironmentVariable("PORT") ?? "5000";
app.Run($"http://0.0.0.0:{port}");
