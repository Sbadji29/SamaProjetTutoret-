
package com.m2GDIL.backend_uniprojet.affectation;

import com.m2GDIL.backend_uniprojet.candidature.Candidature;
import com.m2GDIL.backend_uniprojet.etudiant.Etudiant;
import com.m2GDIL.backend_uniprojet.sujet.Sujet;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(
    name = "affectations",
    uniqueConstraints = {
        @UniqueConstraint(
            name = "uk_affectation_candidature",
            columnNames = {"candidature_id"}
        )
    }
)
public class Affectation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private LocalDateTime dateAffectation;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private StatutAffectation statut = StatutAffectation.ACTIVE;

    @OneToOne(optional = false)
    @JoinColumn(
        name = "candidature_id",
        nullable = false,
        unique = true
    )
    private Candidature candidature;

    @ManyToOne(optional = false)
    @JoinColumn(name = "etudiant_id", nullable = false)
    private Etudiant etudiant;

    @ManyToOne(optional = false)
    @JoinColumn(name = "sujet_id", nullable = false)
    private Sujet sujet;

    public Affectation() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public LocalDateTime getDateAffectation() {
        return dateAffectation;
    }

    public void setDateAffectation(LocalDateTime dateAffectation) {
        this.dateAffectation = dateAffectation;
    }

    public StatutAffectation getStatut() {
        return statut;
    }

    public void setStatut(StatutAffectation statut) {
        this.statut = statut;
    }

    public Candidature getCandidature() {
        return candidature;
    }

    public void setCandidature(Candidature candidature) {
        this.candidature = candidature;
    }

    public Etudiant getEtudiant() {
        return etudiant;
    }

    public void setEtudiant(Etudiant etudiant) {
        this.etudiant = etudiant;
    }

    public Sujet getSujet() {
        return sujet;
    }

    public void setSujet(Sujet sujet) {
        this.sujet = sujet;
    }
}
