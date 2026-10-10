using Microsoft.EntityFrameworkCore;
using MyFirstApi.Data;
using MyFirstApi.IService;
using MyFirstApi.Services;
// using MyFirstApi.Services.EmployeeService;
using Microsoft.AspNetCore.Authentication.Negotiate;

var builder = WebApplication.CreateBuilder(args);

/// connect with sqlserver AND perform migrations..
builder.Services.AddDbContext<AppDbContext>
    (Options => Options.UseSqlServer(builder.Configuration.GetConnectionString("MyConnection")));

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

///services
/// to conncet both interfaceauthservice and authservice
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IEmployeeService, EmployeeService>();

//windows authentication
builder.Services.AddAuthentication(NegotiateDefaults.AuthenticationScheme).AddNegotiate(); // for windows authentication...
builder.Services.AddAuthorization();

// CORS for Vue Frontend
builder.Services.AddCors(options =>
{
    options.AddPolicy("VuePolicy", policy =>
    {
        policy
            .WithOrigins("http://127.0.0.1:5500")
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials();
    });
});



var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();
//
app.UseCors("VuePolicy");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
