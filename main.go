package main

import (
	"embed"
	"log"
	"net/http"
)

//go:embed fontawesome/*
//go:embed *.js
//go:embed *.css
//go:embed edytor.html
var content embed.FS

func main() {
	mutex := http.NewServeMux()
	mutex.Handle("/", http.FileServer(http.FS(content)))
	err := http.ListenAndServe(":8080", mutex)
	if err != nil {
		log.Fatal(err)
	}	
}
