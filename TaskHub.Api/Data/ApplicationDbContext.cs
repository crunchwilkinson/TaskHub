using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using TaskHub.Api.Models;

namespace TaskHub.Api.Data
{
    public class ApplicationDbContext : IdentityDbContext<IdentityUser>
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }
        public DbSet<TaskItem> Tasks { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
        // CRITICAL: You must call base.OnModelCreating first. 
        // If you remove this, Identity will fail to map primary keys for its tables.
        base.OnModelCreating(builder);

        // Explicitly map the relationship (Optional but recommended for clarity)
        builder.Entity<TaskItem>()
            .HasOne<IdentityUser>()
            .WithMany()
            .HasForeignKey(t => t.UserId)
            .IsRequired()
            .OnDelete(DeleteBehavior.Cascade); // If a user is deleted, delete their tasks
        }
    }
}