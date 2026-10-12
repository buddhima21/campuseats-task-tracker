using System.Text;
using CampusEats.Api.Data;
using CampusEats.Api.Models;
using CampusEats.Api.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(
        builder.Configuration.GetConnectionString("Default")
    ));

// Add services to the container.
builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddScoped<IMenuService, MenuService>();

var jwt = builder.Configuration.GetSection("Jwt");
var key = Encoding.UTF8.GetBytes(jwt["Key"]!);

builder.Services
  .AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
  .AddJwtBearer(opt => opt.TokenValidationParameters = new()
  {
      ValidateIssuer = true,
      ValidIssuer = jwt["Issuer"],
      ValidateAudience = true,
      ValidAudience = jwt["Audience"],
      ValidateIssuerSigningKey = true,
      IssuerSigningKey = new SymmetricSecurityKey(key),
      ValidateLifetime = true
  });
builder.Services.AddAuthorization();

builder.Services.AddSwaggerGen(c => 
{ 
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme 
    { 
        Name = "Authorization", In = ParameterLocation.Header, 
        Type = SecuritySchemeType.Http, Scheme = "bearer", 
        BearerFormat = "JWT", 
        Description = "Paste ONLY the token - no 'Bearer ' prefix." 
    }); 
    c.AddSecurityRequirement(new OpenApiSecurityRequirement 
    { 
     { new OpenApiSecurityScheme { Reference = new OpenApiReference 
            { Type = ReferenceType.SecurityScheme, Id = "Bearer" } }, 
          Array.Empty<string>() } 
    }); 
}); 

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    if (!db.MenuItems.Any())
    {
        db.MenuItems.AddRange(
            new MenuItem { Name = "Kottu Roti", Price = 750m, Category = "Mains" },
            new MenuItem { Name = "Fried Rice", Price = 850m, Category = "Mains" },
            new MenuItem { Name = "Watalappan", Price = 350m, Category = "Dessert" });
        db.SaveChanges();
    }
}

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseAuthentication();   // who are you?  (validates JWT) 
app.UseAuthorization();    // may you?      (checks roles)
app.MapControllers();

app.Run();
