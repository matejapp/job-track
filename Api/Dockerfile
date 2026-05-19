# Stage 1: build
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /Api

#Copy only the csproj first so NuGet restore is cached
COPY Api.csproj ./
RUN dotnet restore

COPY . ./
RUN dotnet publish -c Release -o /app --no-restore

# Stage 2: run
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS runtime
WORKDIR /Api
COPY --from=build /app ./

EXPOSE 8080
ENV ASPNETCORE_URLS=http://+:8080

ENTRYPOINT ["dotnet", "Api.dll"]