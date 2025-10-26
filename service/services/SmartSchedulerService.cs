using TaskManagerAPI.Models;

namespace TaskManagerAPI.Services
{
    public class SmartSchedulerService
    {
        public ScheduleResponseDto GenerateSchedule(
            List<ProjectTask> tasks,
            int availableHoursPerDay,
            DateTime startDate)
        {
            var schedule = new List<ScheduledTaskDto>();
            var currentDate = startDate;
            var remainingHoursToday = availableHoursPerDay;

            // Sort tasks by due date (earliest first), then by priority
            var sortedTasks = tasks
                .Where(t => !t.IsCompleted)
                .OrderBy(t => t.DueDate ?? DateTime.MaxValue)
                .ThenBy(t => t.CreatedAt)
                .ToList();

            foreach (var task in sortedTasks)
            {
                // Estimate hours based on task complexity (simple heuristic)
                var estimatedHours = EstimateTaskHours(task);

                // If task doesn't fit today, move to next day
                if (estimatedHours > remainingHoursToday)
                {
                    currentDate = currentDate.AddDays(1);
                    remainingHoursToday = availableHoursPerDay;
                }

                // Schedule the task
                schedule.Add(new ScheduledTaskDto
                {
                    TaskId = task.Id,
                    TaskTitle = task.Title,
                    ScheduledDate = currentDate,
                    EstimatedHours = estimatedHours
                });

                // Update remaining hours
                remainingHoursToday -= estimatedHours;

                // If no hours left today, move to next day
                if (remainingHoursToday <= 0)
                {
                    currentDate = currentDate.AddDays(1);
                    remainingHoursToday = availableHoursPerDay;
                }
            }

            return new ScheduleResponseDto { Schedule = schedule };
        }

        private int EstimateTaskHours(ProjectTask task)
        {
            // Simple estimation based on title length and due date urgency
            var baseHours = 2;

            // Longer titles might indicate more complex tasks
            if (task.Title.Length > 50) baseHours += 1;

            // Tasks with near due dates might need more focus
            if (task.DueDate.HasValue)
            {
                var daysUntilDue = (task.DueDate.Value - DateTime.Now).Days;
                if (daysUntilDue <= 3) baseHours += 1;
            }

            return Math.Min(baseHours, 8); // Cap at 8 hours
        }
    }
}
