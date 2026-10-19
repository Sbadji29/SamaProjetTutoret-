
package com.m2GDIL.backend_uniprojet.candidature;

import com.m2GDIL.backend_uniprojet.etudiant.Etudiant;
import com.m2GDIL.backend_uniprojet.sujet.Sujet;
import com.m2GDIL.backend_uniprojet.sessionuniversitaire.SessionUniversitaire;
import com.m2GDIL.backend_uniprojet.enseignant.Enseignant;
import com.m2GDIL.backend_uniprojet.responsablepedagogique.ResponsablePedagogique;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(
    name = "candidatures",
    uniqueConstraints = {
        @UniqueConstraint(
            name = "uk_candidature_etudiant_sujet_session",
            columnNames = {
                "etudiant_id",
                "sujet_id",
                "session_id"
            }
        )
    }
)
public class Candidature {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDateTime dateCandidature;

    @Column(nullable = false)
    private Integer priorite;

    @Column(columnDefinition = "TEXT")
    private String motivation;

    @Column(columnDefinition = "TEXT")
    private String avisEncadrant;

    @Column(columnDefinition = "TEXT")
    private String commentaireDecision;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private StatutCandidature statut = StatutCandidature.EN_ATTENTE;

    @ManyToOne(optional = false)
    @JoinColumn(name = "etudiant_id", nullable = false)
    private Etudiant etudiant;

    @ManyToOne(optional = false)
    @JoinColumn(name = "sujet_id", nullable = false)
    private Sujet sujet;

    @ManyToOne(optional = false)
    @JoinColumn(name = "session_id", nullable = false)
    private SessionUniversitaire sessionUniversitaire;

    @ManyToOne
    @JoinColumn(name = "enseignant_id")
    private Enseignant enseignant;

    @ManyToOne
    @JoinColumn(name = "responsable_pedagogique_id")
    private ResponsablePedagogique responsablePedagogique;

    public Candidature() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public LocalDateTime getDateCandidature() {
        return dateCandidature;
    }

    public void setDateCandidature(LocalDateTime dateCandidature) {
        this.dateCandidature = dateCandidature;
    }

    public Integer getPriorite() {
        return priorite;
    }

    public void setPriorite(Integer priorite) {
        this.priorite = priorite;
    }

    public String getMotivation() {
        return motivation;
    }

    public void setMotivation(String motivation) {
        this.motivation = motivation;
    }

    public String getAvisEncadrant() {
        return avisEncadrant;
    }

    public void setAvisEncadrant(String avisEncadrant) {
        this.avisEncadrant = avisEncadrant;
    }

    public String getCommentaireDecision() {
        return commentaireDecision;
    }

    public void setCommentaireDecision(String commentaireDecision) {
        this.commentaireDecision = commentaireDecision;
    }

    public StatutCandidature getStatut() {
        return statut;
    }

    public void setStatut(StatutCandidature statut) {
        this.statut = statut;
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

    public SessionUniversitaire getSessionUniversitaire() {
        return sessionUniversitaire;
    }

    public void setSessionUniversitaire(
            SessionUniversitaire sessionUniversitaire) {
        this.sessionUniversitaire = sessionUniversitaire;
    }

    public Enseignant getEnseignant() {
        return enseignant;
    }

    public void setEnseignant(Enseignant enseignant) {
        this.enseignant = enseignant;
    }

    public ResponsablePedagogique getResponsablePedagogique() {
        return responsablePedagogique;
    }

    public void setResponsablePedagogique(
            ResponsablePedagogique responsablePedagogique) {
        this.responsablePedagogique = responsablePedagogique;
    }
}
