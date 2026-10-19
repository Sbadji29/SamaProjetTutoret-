
package com.m2GDIL.backend_uniprojet.administrateur;

import com.m2GDIL.backend_uniprojet.utilisateur.Utilisateur;
import com.m2GDIL.backend_uniprojet.utilisateur.UtilisateurRepository;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class AdministrateurService {

    private final AdministrateurRepository administrateurRepository;
    private final UtilisateurRepository utilisateurRepository;

    public AdministrateurService(
            AdministrateurRepository administrateurRepository,
            UtilisateurRepository utilisateurRepository) {

        this.administrateurRepository = administrateurRepository;
        this.utilisateurRepository = utilisateurRepository;
    }

    // Creer un profil administrateur
    @Transactional
    public Administrateur creer(Long utilisateurId) {

        if (administrateurRepository
                .existsByUtilisateurId(utilisateurId)) {
            throw new IllegalArgumentException(
                "Ce compte possede deja un profil administrateur.");
        }

        Utilisateur utilisateur = utilisateurRepository
            .findById(utilisateurId)
            .orElseThrow(() -> new IllegalArgumentException(
                "Utilisateur introuvable : " + utilisateurId));

        Administrateur administrateur = new Administrateur();
        administrateur.setUtilisateur(utilisateur);

        return administrateurRepository.save(administrateur);
    }

    // Lister les administrateurs
    public List<Administrateur> obtenirTous() {
        return administrateurRepository.findAll();
    }

    // Consulter par identifiant
    public Administrateur obtenirParId(Long id) {
        return administrateurRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException(
                "Administrateur introuvable : " + id));
    }

    // Rechercher par compte utilisateur
    public Administrateur obtenirParUtilisateur(Long utilisateurId) {
        return administrateurRepository
            .findByUtilisateurId(utilisateurId)
            .orElseThrow(() -> new IllegalArgumentException(
                "Aucun administrateur pour cet utilisateur."));
    }

    // Supprimer un profil administrateur
    @Transactional
    public void supprimer(Long id) {
        Administrateur administrateur = obtenirParId(id);
        administrateurRepository.delete(administrateur);
    }

    // Compter les administrateurs
    public long compter() {
        return administrateurRepository.count();
    }
}
