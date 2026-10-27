package com.librarydesk.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.servers.Server;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI libraryDeskOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("LIBRARY / DESK — REST API")
                        .description("Backend RESTful services for LIBRARY / DESK Library Management System. Provides full CRUD, circulation management, search, filtering, and reporting.")
                        .version("1.0.0")
                        .contact(new Contact()
                                .name("LIBRARY / DESK Engineering Team")
                                .url("https://github.com/Kurinji-Eswar/library-desk"))
                        .license(new License()
                                .name("MIT License")
                                .url("https://opensource.org/licenses/MIT")))
                .servers(List.of(
                        new Server().url("http://localhost:8080").description("Local Development Server")
                ));
    }
}
