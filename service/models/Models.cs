using System.ComponentModel.DataAnnotations;

namespace TaskManagerAPI.Models
{

    // NEW: User model
    public class User
    {
        public int Id { get; set; }
        [Required]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;
        [Required]
        public string Password { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
        public List<Project> Projects { get; set; } = new();
    }

    // NEW: Project model
    public class Project
    {
        public int Id { get; set; }

        [Required]
        [StringLength(100, MinimumLength = 3)]
        public string Title { get; set; } = string.Empty;

        [StringLength(500)]
        public string? Description { get; set; }

        public DateTime CreatedAt { get; set; }
        public int UserId { get; set; }
        public User User { get; set; } = null!;
        public List<ProjectTask> Tasks { get; set; } = new();
    }

    public class ProjectTask
    {
        public int Id { get; set; }

        [Required]
        public string Title { get; set; } = string.Empty;

        [Required]
        public DateTime DueDate { get; set; }

        [Required]
        [Range(1, 50)]
        public int EstimatedHours { get; set; }

        public bool IsCompleted { get; set; }
        public DateTime CreatedAt { get; set; }

        public int ProjectId { get; set; }
        public Project Project { get; set; } = null!;
    }

    // DTOs
    public class RegisterDto
    {
        [Required]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;

        [Required]
        [MinLength(6)]
        public string Password { get; set; } = string.Empty;
    }

    public class LoginDto
    {
        [Required]
        public string Email { get; set; } = string.Empty;

        [Required]
        public string Password { get; set; } = string.Empty;
    }

    public class CreateProjectDto
    {
        [Required]
        [StringLength(100, MinimumLength = 3)]
        public string Title { get; set; } = string.Empty;

        [StringLength(500)]
        public string? Description { get; set; }
    }

    public class CreateProjectTaskDto
    {
        [Required]
        public string Title { get; set; } = string.Empty;

        [Required]
        public DateTime DueDate { get; set; }  // Required

        [Required]
        [Range(1, 50)]
        public int EstimatedHours { get; set; }  // NEW: Required
    }

    public class UpdateProjectTaskDto
    {
        [Required]
        public string Title { get; set; } = string.Empty;

        [Required]
        public DateTime DueDate { get; set; }  // Required

        [Required]
        [Range(1, 50)]
        public int EstimatedHours { get; set; }  // NEW: Required

        public bool IsCompleted { get; set; }
    }

    public class ProjectTaskResponseDto
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public DateTime DueDate { get; set; }  // Not nullable
        public int EstimatedHours { get; set; }  // NEW
        public bool IsCompleted { get; set; }
        public DateTime CreatedAt { get; set; }
        public int ProjectId { get; set; }
    }

    // Smart Scheduler DTOs
    public class ScheduleRequestDto
    {
        [Required]
        public DateTime StartDate { get; set; }
    }

    public class ScheduledTaskDto
    {
        public int TaskId { get; set; }
        public string TaskTitle { get; set; } = string.Empty;
        public DateTime ScheduledDate { get; set; }
        public DateTime DueDate { get; set; }
        public int EstimatedHours { get; set; }
    }

    public class ScheduleResponseDto
    {
        public List<ScheduledTaskDto> Schedule { get; set; } = new();
        public int TotalHours { get; set; }
        public int TotalDays { get; set; }
    }
}
