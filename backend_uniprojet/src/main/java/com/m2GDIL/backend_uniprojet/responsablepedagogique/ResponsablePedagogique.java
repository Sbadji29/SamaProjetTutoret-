
package com.m2GDIL.backend_uniprojet.responsablepedagogique;

import com.m2GDIL.backend_uniprojet.utilisateur.Utilisateur;

import jakarta.persistence.*;

@Entity
@Table(name = "responsables_pedagogiques")
public class ResponsablePedagogique {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(
        name = "utilisateur_id",
        nullable = false,
        unique = true
    )
    private Utilisateur utilisateur;

    public ResponsablePedagogique() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Utilisateur getUtilisateur() {
        return utilisateur;
    }

    public void setUtilisateur(Utilisateur utilisateur) {
        this.utilisateur = utilisateur;
    }
}
