
package com.m2GDIL.backend_uniprojet.etudiant;

import com.m2GDIL.backend_uniprojet.utilisateur.Utilisateur;
import com.m2GDIL.backend_uniprojet.utilisateur.UtilisateurRepository;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class EtudiantService {

    private final EtudiantRepository etudiantRepository;
    private final UtilisateurRepository utilisateurRepository;

    public EtudiantService(
            EtudiantRepository etudiantRepository,
            UtilisateurRepository utilisateurRepository) {
        this.etudiantRepository = etudiantRepository;
        this.utilisateurRepository = utilisateurRepository;
    }

    // Creer un profil etudiant pour un compte existant
    @Transactional
    public Etudiant creer(Etudiant etudiant, Long utilisateurId) {

        if (etudiantRepository.existsByNumeroEtudiant(
                etudiant.getNumeroEtudiant())) {
            throw new IllegalArgumentException(
                "Ce numero etudiant existe deja.");
        }

        if (etudiantRepository.existsByUtilisateurId(utilisateurId)) {
            throw new IllegalArgumentException(
                "Ce compte possede deja un profil etudiant.");
        }

        Utilisateur utilisateur = utilisateurRepository
            .findById(utilisateurId)
            .orElseThrow(() -> new IllegalArgumentException(
                "Utilisateur introuvable : " + utilisateurId));

        etudiant.setUtilisateur(utilisateur);

        return etudiantRepository.save(etudiant);
    }

    // Obtenir tous les etudiants
    public List<Etudiant> obtenirTous() {
        return etudiantRepository.findAll();
    }

    // Obtenir un etudiant par son identifiant
    public Etudiant obtenirParId(Long id) {
        return etudiantRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException(
                "Etudiant introuvable : " + id));
    }

    // Rechercher par numero etudiant
    public Etudiant obtenirParNumero(String numero) {
        return etudiantRepository.findByNumeroEtudiant(numero)
            .orElseThrow(() -> new IllegalArgumentException(
                "Etudiant introuvable pour ce numero."));
    }

    // Rechercher par compte utilisateur
    public Etudiant obtenirParUtilisateur(Long utilisateurId) {
        return etudiantRepository.findByUtilisateurId(utilisateurId)
            .orElseThrow(() -> new IllegalArgumentException(
                "Aucun profil etudiant pour cet utilisateur."));
    }

    // Rechercher par filiere
    public List<Etudiant> obtenirParFiliere(String filiere) {
        return etudiantRepository.findByFiliereIgnoreCase(filiere);
    }

    // Rechercher par niveau
    public List<Etudiant> obtenirParNiveau(String niveau) {
        return etudiantRepository.findByNiveauIgnoreCase(niveau);
    }

    // Modifier les informations academiques
    @Transactional
    public Etudiant modifier(Long id, Etudiant donnees) {
        Etudiant etudiant = obtenirParId(id);

        if (donnees.getNumeroEtudiant() != null
                && !donnees.getNumeroEtudiant().isBlank()) {

            String numero = donnees.getNumeroEtudiant().trim();

            if (!numero.equals(etudiant.getNumeroEtudiant())
                    && etudiantRepository
                    .existsByNumeroEtudiant(numero)) {
                throw new IllegalArgumentException(
                    "Ce numero etudiant existe deja.");
            }

            etudiant.setNumeroEtudiant(numero);
        }

        if (donnees.getFiliere() != null
                && !donnees.getFiliere().isBlank()) {
            etudiant.setFiliere(donnees.getFiliere().trim());
        }

        if (donnees.getNiveau() != null
                && !donnees.getNiveau().isBlank()) {
            etudiant.setNiveau(donnees.getNiveau().trim());
        }

        return etudiantRepository.save(etudiant);
    }

    // Supprimer un profil etudiant sans supprimer le compte
    @Transactional
    public void supprimer(Long id) {
        Etudiant etudiant = obtenirParId(id);
        etudiantRepository.delete(etudiant);
    }

    // Compter les etudiants
    public long compter() {
        return etudiantRepository.count();
    }
}
