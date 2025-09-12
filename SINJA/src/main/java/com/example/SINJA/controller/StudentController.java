package com.example.SINJA.controller;

import com.example.SINJA.model.Student;
import com.example.SINJA.service.StudentService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin(origins = "*")
public class StudentController {

    private static final Logger log = LoggerFactory.getLogger(StudentController.class);
    private final StudentService studentService;

    public StudentController(StudentService studentService){
        this.studentService = studentService;
    }

    @PostMapping("/save")
    public ResponseEntity<Student> save(@RequestBody Student student){
        try{
            Student stundetSave = studentService.save(student);
            return ResponseEntity.ok(stundetSave);
        }catch (Exception e){
            log.error("Error al guardar al estudiantes", e);
            return ResponseEntity.badRequest().build();
        }

    }

    @GetMapping("/search")
    public ResponseEntity<Student> searchById(@RequestParam Long id){
        try{
            Student studentFinded = studentService.findById(id);
            if(studentFinded!=null){
                return ResponseEntity.ok(studentFinded);
            }else {
                log.info("El estudiante no existe");
                return ResponseEntity.badRequest().build();
            }
        }catch (Exception e){
            log.error("Error al buscar el estudiante", e);
            return ResponseEntity.badRequest().build();
        }

    }
}
