using TaskManagerAPI.Models;

namespace TaskManagerAPI.Services
{
    public class SmartSchedulerService
    {
        public ScheduleResponseDto GenerateSchedule(
            List<ProjectTask> tasks,
            DateTime startDate)
        {
            var schedule = new List<ScheduledTaskDto>();
            var currentDate = startDate;

            // Filter incomplete tasks only
            var incompleteTasks = tasks
                .Where(t => !t.IsCompleted)
                .ToList();

            // Sort by: 1) Earliest due date, 2) Shortest duration (tie breaker)
            var sortedTasks = incompleteTasks
                .OrderBy(t => t.DueDate)
                .ThenBy(t => t.EstimatedHours)
                .ToList();

            foreach (var task in sortedTasks)
            {
                schedule.Add(new ScheduledTaskDto
                {
                    TaskId = task.Id,
                    TaskTitle = task.Title,
                    ScheduledDate = currentDate,
                    DueDate = task.DueDate,
                    EstimatedHours = task.EstimatedHours
                });

                // Move to next day after each task
                currentDate = currentDate.AddDays(1);
            }

            var totalHours = sortedTasks.Sum(t => t.EstimatedHours);
            var totalDays = schedule.Count;

            return new ScheduleResponseDto
            {
                Schedule = schedule,
                TotalHours = totalHours,
                TotalDays = totalDays
            };
        }
    }
}
