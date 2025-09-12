package com.example.SINJA.repository.impl;

import com.example.SINJA.model.CampusUdea;
import com.example.SINJA.model.Student;
import com.example.SINJA.repository.StudentsRepository;
import org.springframework.stereotype.Repository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import java.io.*;

@Repository
public class StudentsRepositoryImpl implements StudentsRepository {

    private static final Logger log = LoggerFactory.getLogger(StudentsRepositoryImpl.class);

    @Override
    public Student save(Student student) {
        try {
            File file = new File("SINJA/src/main/resources/Students");
            BufferedWriter writer = new BufferedWriter(new FileWriter(file, true));

            if (file.length() > 0) {
                writer.newLine();
            }

            writer.write(student.getId() + "\t" + student.getName() + "\t" + student.getLastName()
                    + "\t" + student.getBornPlace() + "\t" + student.getDegree() + "\t"
                    + student.getPlace().name() + "\t" + student.getScoreAdmision());

            writer.close();
        } catch (IOException e) {
            log.error("The student has not been saved " + e.getMessage());
        }
        return student;
    }


    @Override
    public void delete(Long id) {

    }

    @Override
    public Student findById(Long id) {
        try{
            BufferedReader reader = new BufferedReader(new FileReader("SINJA/src/main/resources/Students"));
            String line;
            while ((line = reader.readLine()) != null){
                String[] data = line.split("\t");
                if(Long.parseLong(data[0]) == id){
                    return new Student(id, data[1], data[2], data[3], data[4], CampusUdea.valueOf(data[5]), Integer.parseInt(data[6]));
                }

            }
        }catch (IOException e){
            log.error("The student has not been found " + e.getMessage());
        }
        return null;
    }
}
