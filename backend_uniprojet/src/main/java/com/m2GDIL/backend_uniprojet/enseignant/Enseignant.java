
package com.m2GDIL.backend_uniprojet.enseignant;

import com.m2GDIL.backend_uniprojet.utilisateur.Utilisateur;
import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;

@Entity
@Table(name = "enseignants")
public class Enseignant {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Le matricule est obligatoire")
    @Column(nullable = false, unique = true)
    private String matricule;

    @NotBlank(message = "La specialite est obligatoire")
    @Column(nullable = false)
    private String specialite;

    @Column(length = 150)
    private String laboratoire;

    @NotBlank(message = "Le departement est obligatoire")
    @Column(nullable = false)
    private String departement;

    @Min(value = 0, message = "Le quota ne peut pas etre negatif")
    @Column(nullable = false)
    private Integer quotaEncadrement = 0;

    @OneToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(
        name = "utilisateur_id",
        nullable = false,
        unique = true
    )
    private Utilisateur utilisateur;

    public Enseignant() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getMatricule() {
        return matricule;
    }

    public void setMatricule(String matricule) {
        this.matricule = matricule;
    }

    public String getSpecialite() {
        return specialite;
    }

    public void setSpecialite(String specialite) {
        this.specialite = specialite;
    }

    public String getLaboratoire() {
        return laboratoire;
    }

    public void setLaboratoire(String laboratoire) {
        this.laboratoire = laboratoire;
    }

    public String getDepartement() {
        return departement;
    }

    public void setDepartement(String departement) {
        this.departement = departement;
    }

    public Integer getQuotaEncadrement() {
        return quotaEncadrement;
    }

    public void setQuotaEncadrement(Integer quotaEncadrement) {
        this.quotaEncadrement = quotaEncadrement;
    }

    public Utilisateur getUtilisateur() {
        return utilisateur;
    }

    public void setUtilisateur(Utilisateur utilisateur) {
        this.utilisateur = utilisateur;
    }
}
