package com.example.SINJA.service;

import com.example.SINJA.model.Student;

public interface StudentService {
    Student save(Student student);
    void delete(Long id);
    Student findById(Long id);
}
