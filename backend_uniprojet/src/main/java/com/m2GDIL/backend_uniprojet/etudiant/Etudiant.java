
package com.m2GDIL.backend_uniprojet.etudiant;

import com.m2GDIL.backend_uniprojet.utilisateur.Utilisateur;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;

@Entity
@Table(name = "etudiants")
public class Etudiant {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Le numéro étudiant est obligatoire")
    @Column(nullable = false, unique = true)
    private String numeroEtudiant;

    @NotBlank(message = "La filière est obligatoire")
    @Column(nullable = false)
    private String filiere;

    @NotBlank(message = "Le niveau est obligatoire")
    @Column(nullable = false)
    private String niveau;

    @OneToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(
        name = "utilisateur_id",
        nullable = false,
        unique = true
    )
    private Utilisateur utilisateur;

    public Etudiant() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNumeroEtudiant() {
        return numeroEtudiant;
    }

    public void setNumeroEtudiant(String numeroEtudiant) {
        this.numeroEtudiant = numeroEtudiant;
    }

    public String getFiliere() {
        return filiere;
    }

    public void setFiliere(String filiere) {
        this.filiere = filiere;
    }

    public String getNiveau() {
        return niveau;
    }

    public void setNiveau(String niveau) {
        this.niveau = niveau;
    }

    public Utilisateur getUtilisateur() {
        return utilisateur;
    }

    public void setUtilisateur(Utilisateur utilisateur) {
        this.utilisateur = utilisateur;
    }
}
