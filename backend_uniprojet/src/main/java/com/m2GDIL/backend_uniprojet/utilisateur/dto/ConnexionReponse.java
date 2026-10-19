package com.m2GDIL.backend_uniprojet.utilisateur.dto;

public class ConnexionReponse {

    private Long id;
    private String nom;
    private String prenom;
    private String email;
    private String role;
    private Long profilId;

    public ConnexionReponse() {
    }

    public ConnexionReponse(Long id, String nom, String prenom, String email, String role, Long profilId) {
        this.id = id;
        this.nom = nom;
        this.prenom = prenom;
        this.email = email;
        this.role = role;
        this.profilId = profilId;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNom() {
        return nom;
    }

    public void setNom(String nom) {
        this.nom = nom;
    }

    public String getPrenom() {
        return prenom;
    }

    public void setPrenom(String prenom) {
        this.prenom = prenom;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public Long getProfilId() {
        return profilId;
    }

    public void setProfilId(Long profilId) {
        this.profilId = profilId;
    }
}
