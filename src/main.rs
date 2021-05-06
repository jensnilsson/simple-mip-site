use actix_files as fs;
use actix_web::{App, HttpServer, post, web, HttpResponse, Responder};
use serde_json;
use simple_mip_optimizer::{Program};

#[actix_web::main]
async fn main() -> std::io::Result<()> {

    let app = move || {
        App::new()
            .service(solve)
            .service(fs::Files::new("/", "./public").index_file("./index.html"))
        };

    println!("Starting server...");
    HttpServer::new(app).bind("127.0.0.1:8080")?.run().await
}

#[post("/solve")]
async fn solve(data: web::Json<serde_json::Value>) -> impl Responder {
    println!("Request: {}", &data.to_string());
    let program = Program::new();
    let response = program.execute(&data.to_string());
    HttpResponse::Ok().body(response)
}