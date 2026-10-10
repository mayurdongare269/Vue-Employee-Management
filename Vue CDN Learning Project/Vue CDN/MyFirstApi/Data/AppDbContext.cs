using Microsoft.EntityFrameworkCore;
using MyFirstApi.Entities;

namespace MyFirstApi.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) // trick: ctor + tab
        {
            
        }

        public DbSet<User> AccountUsers {get; set;} 
        public DbSet<Employee> Employees {get; set;}
        // public DbSet<Department> Departments {get; set;}
        // public DbSet<Salary> salaries {get; set;}
    }
}