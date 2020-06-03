package main

import (
	"fmt"
	"log"
	"net/http"
	"html/template"
	"io/ioutil"
)

func main() {
	log.SetFlags(log.LstdFlags | log.Lshortfile)	//Добавляем в лог номер строки
	const dir string = "web"						//Путь к рабочей папке

	http.HandleFunc("/getFileContent", func(w http.ResponseWriter, r *http.Request) {
		content, err := ioutil.ReadFile(dir+"/src/"+r.PostFormValue("fileName"))
	    if err != nil {
	        fmt.Fprint(w, err)
			return
	    }
		fmt.Fprint(w, string(content))
	})

	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		t, err := template.ParseFiles(dir+"/index.html")
		if err != nil {
			log.Println(err)
			return
		}
		t.Execute(w, "")
	})
	http.HandleFunc("/favicon.ico", func(w http.ResponseWriter, r *http.Request) {}) //Чтобы Chrome запускал сайт 1 раз

	http.Handle("/js/", http.FileServer(http.Dir(dir)))
	http.Handle("/css/", http.FileServer(http.Dir(dir)))
	http.Handle("/src/", http.FileServer(http.Dir(dir)))

	fmt.Println("Сервер успешно запущен!")
	log.Fatal(http.ListenAndServe(":8000", nil))
}
