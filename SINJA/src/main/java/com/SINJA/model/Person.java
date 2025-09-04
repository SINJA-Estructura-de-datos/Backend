package com.SINJA.model;

public class Person {
    private Long id;
    private String name;
    private String lastName;
    private String bornPlace;

    public Person(){
    }
    public Person(Long id, String name, String lastName, String bornPlace) {
        this.id = id;
        this.name = name;
        this.lastName = lastName;
        this.bornPlace = bornPlace;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getBornPlace() {
        return bornPlace;
    }

    public void setBornPlace(String bornPlace) {
        this.bornPlace = bornPlace;
    }
}
