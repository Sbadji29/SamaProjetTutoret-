
package com.m2GDIL.backend_uniprojet.sujet;

import com.m2GDIL.backend_uniprojet.enseignant.Enseignant;
import com.m2GDIL.backend_uniprojet.sessionuniversitaire.SessionUniversitaire;

import jakarta.persistence.*;

@Entity
@Table(
    name = "sujets",
    uniqueConstraints = {
        @UniqueConstraint(
            name = "uk_sujet_reference_session",
            columnNames = {"reference", "session_id"}
        )
    }
)
public class Sujet {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String reference;

    @Column(nullable = false)
    private String titre;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(columnDefinition = "TEXT")
    private String objectifs;

    private String niveau;

    @Column(nullable = false)
    private Integer capaciteMax;

    @Column(nullable = false)
    private Boolean disponible = true;

    @ManyToOne(optional = false)
    @JoinColumn(name = "enseignant_id", nullable = false)
    private Enseignant enseignant;

    @ManyToOne(optional = false)
    @JoinColumn(name = "session_id", nullable = false)
    private SessionUniversitaire sessionUniversitaire;

    public Sujet() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getReference() {
        return reference;
    }

    public void setReference(String reference) {
        this.reference = reference;
    }

    public String getTitre() {
        return titre;
    }

    public void setTitre(String titre) {
        this.titre = titre;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getObjectifs() {
        return objectifs;
    }

    public void setObjectifs(String objectifs) {
        this.objectifs = objectifs;
    }

    public String getNiveau() {
        return niveau;
    }

    public void setNiveau(String niveau) {
        this.niveau = niveau;
    }

    public Integer getCapaciteMax() {
        return capaciteMax;
    }

    public void setCapaciteMax(Integer capaciteMax) {
        this.capaciteMax = capaciteMax;
    }

    public Boolean getDisponible() {
        return disponible;
    }

    public void setDisponible(Boolean disponible) {
        this.disponible = disponible;
    }

    public Enseignant getEnseignant() {
        return enseignant;
    }

    public void setEnseignant(Enseignant enseignant) {
        this.enseignant = enseignant;
    }

    public SessionUniversitaire getSessionUniversitaire() {
        return sessionUniversitaire;
    }

    public void setSessionUniversitaire(
            SessionUniversitaire sessionUniversitaire) {
        this.sessionUniversitaire = sessionUniversitaire;
    }
}
