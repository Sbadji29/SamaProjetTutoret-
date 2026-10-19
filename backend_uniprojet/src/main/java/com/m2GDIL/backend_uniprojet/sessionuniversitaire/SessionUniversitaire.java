
package com.m2GDIL.backend_uniprojet.sessionuniversitaire;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "sessions_universitaires")
public class SessionUniversitaire {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String libelle;

    @Column(nullable = false)
    private LocalDate dateDebut;

    @Column(nullable = false)
    private LocalDate dateFin;

    private LocalDateTime dateClotureVoeux;

    private LocalDateTime dateLimiteEvaluation;

    @Column(nullable = false)
    private Boolean active = false;

    // Constructeur vide
    public SessionUniversitaire() {
    }

    // Getters et setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getLibelle() {
        return libelle;
    }

    public void setLibelle(String libelle) {
        this.libelle = libelle;
    }

    public LocalDate getDateDebut() {
        return dateDebut;
    }

    public void setDateDebut(LocalDate dateDebut) {
        this.dateDebut = dateDebut;
    }

    public LocalDate getDateFin() {
        return dateFin;
    }

    public void setDateFin(LocalDate dateFin) {
        this.dateFin = dateFin;
    }

    public LocalDateTime getDateClotureVoeux() {
        return dateClotureVoeux;
    }

    public void setDateClotureVoeux(
            LocalDateTime dateClotureVoeux) {
        this.dateClotureVoeux = dateClotureVoeux;
    }

    public LocalDateTime getDateLimiteEvaluation() {
        return dateLimiteEvaluation;
    }

    public void setDateLimiteEvaluation(
            LocalDateTime dateLimiteEvaluation) {
        this.dateLimiteEvaluation = dateLimiteEvaluation;
    }

    public Boolean getActive() {
        return active;
    }

    public void setActive(Boolean active) {
        this.active = active;
    }
}
