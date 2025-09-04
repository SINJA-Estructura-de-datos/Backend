package com.SINJA.model;

public class Student extends Person{
    private String degree;
    private CampusUdea place;
    private Integer scoreAdmision;

    public Student(Long id, String name, String lastName, String bornPlace,
                   String degree, CampusUdea place, Integer scoreAdmision) {
        super(id, name, lastName, bornPlace);
        this.degree = degree;
        this.place = place;
        this.scoreAdmision = scoreAdmision;
    }

    public String getDegree() {
        return degree;
    }

    public void setDegree(String degree) {
        this.degree = degree;
    }

    public CampusUdea getPlace() {
        return place;
    }

    public void setPlace(CampusUdea place) {
        this.place = place;
    }

    public Integer getScoreAdmision() {
        return scoreAdmision;
    }

    public void setScoreAdmision(Integer scoreAdmision) {
        this.scoreAdmision = scoreAdmision;
    }
}
