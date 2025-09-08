package com.example.SINJA.controller;

import com.example.SINJA.model.Student;
import com.example.SINJA.service.StudentService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.*;

@RestController
public class StudentController {

    private static final Logger log = LoggerFactory.getLogger(StudentController.class);
    private final StudentService studentService;

    public StudentController(StudentService studentService){
        this.studentService = studentService;
    }

    @PostMapping("/save")
    public Student save(@RequestBody Student student){
        log.info("Entrando al meotodo save con los datos {}", student);
        return studentService.save(student);
    }

    @GetMapping("/search")
    public Student searchById(@RequestParam Long id){
        return studentService.findById(id);
    }
}
