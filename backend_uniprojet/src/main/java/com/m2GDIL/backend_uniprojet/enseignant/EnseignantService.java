
package com.m2GDIL.backend_uniprojet.enseignant;

import com.m2GDIL.backend_uniprojet.utilisateur.Utilisateur;
import com.m2GDIL.backend_uniprojet.utilisateur.UtilisateurRepository;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class EnseignantService {

    private final EnseignantRepository enseignantRepository;
    private final UtilisateurRepository utilisateurRepository;

    public EnseignantService(
            EnseignantRepository enseignantRepository,
            UtilisateurRepository utilisateurRepository) {
        this.enseignantRepository = enseignantRepository;
        this.utilisateurRepository = utilisateurRepository;
    }

    // Creer un profil enseignant
    @Transactional
    public Enseignant creer(Enseignant enseignant, Long utilisateurId) {

        if (enseignantRepository.existsByMatricule(
                enseignant.getMatricule())) {
            throw new IllegalArgumentException(
                "Ce matricule existe deja.");
        }

        if (enseignantRepository.existsByUtilisateurId(utilisateurId)) {
            throw new IllegalArgumentException(
                "Ce compte possede deja un profil enseignant.");
        }

        Utilisateur utilisateur = utilisateurRepository
            .findById(utilisateurId)
            .orElseThrow(() -> new IllegalArgumentException(
                "Utilisateur introuvable : " + utilisateurId));

        if (enseignant.getQuotaEncadrement() == null
                || enseignant.getQuotaEncadrement() < 0) {
            throw new IllegalArgumentException(
                "Le quota doit etre positif ou nul.");
        }

        enseignant.setUtilisateur(utilisateur);
        enseignant.setMatricule(enseignant.getMatricule().trim());

        return enseignantRepository.save(enseignant);
    }

    // Lister tous les enseignants
    public List<Enseignant> obtenirTous() {
        return enseignantRepository.findAll();
    }

    // Consulter un enseignant par ID
    public Enseignant obtenirParId(Long id) {
        return enseignantRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException(
                "Enseignant introuvable : " + id));
    }

    // Rechercher par matricule
    public Enseignant obtenirParMatricule(String matricule) {
        return enseignantRepository.findByMatricule(matricule)
            .orElseThrow(() -> new IllegalArgumentException(
                "Enseignant introuvable pour ce matricule."));
    }

    // Rechercher par compte utilisateur
    public Enseignant obtenirParUtilisateur(Long utilisateurId) {
        return enseignantRepository.findByUtilisateurId(utilisateurId)
            .orElseThrow(() -> new IllegalArgumentException(
                "Aucun profil enseignant pour cet utilisateur."));
    }

    // Rechercher par specialite
    public List<Enseignant> obtenirParSpecialite(String specialite) {
        return enseignantRepository
            .findBySpecialiteContainingIgnoreCase(specialite);
    }

    // Rechercher par departement
    public List<Enseignant> obtenirParDepartement(String departement) {
        return enseignantRepository
            .findByDepartementIgnoreCase(departement);
    }

    // Modifier les informations professionnelles
    @Transactional
    public Enseignant modifier(Long id, Enseignant donnees) {

        Enseignant enseignant = enseignantRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException(
                "Enseignant introuvable : " + id));

        // Modifier le matricule
        if (donnees.getMatricule() != null
                && !donnees.getMatricule().isBlank()) {

            String matricule = donnees.getMatricule().trim();

            boolean matriculeExiste =
                enseignantRepository.existsByMatricule(matricule);

            if (matriculeExiste
                    && !matricule.equals(enseignant.getMatricule())) {
                throw new IllegalArgumentException(
                    "Ce matricule existe deja.");
            }

            enseignant.setMatricule(matricule);
        }

        // Modifier la specialite
        if (donnees.getSpecialite() != null) {
            enseignant.setSpecialite(
                donnees.getSpecialite().trim());
        }

        // Modifier le laboratoire
        if (donnees.getLaboratoire() != null) {
            enseignant.setLaboratoire(
                donnees.getLaboratoire().trim());
        }

        // Modifier le departement
        if (donnees.getDepartement() != null) {
            enseignant.setDepartement(
                donnees.getDepartement().trim());
        }

        // Modifier le quota d'encadrement
        if (donnees.getQuotaEncadrement() != null) {
            if (donnees.getQuotaEncadrement() < 0) {
                throw new IllegalArgumentException(
                    "Le quota ne peut pas etre negatif.");
            }

            enseignant.setQuotaEncadrement(
                donnees.getQuotaEncadrement());
        }

        return enseignantRepository.save(enseignant);
    }


    // Supprimer un profil enseignant
    @Transactional
    public void supprimer(Long id) {
        Enseignant enseignant = obtenirParId(id);
        enseignantRepository.delete(enseignant);
    }

    // Compter les enseignants
    public long compter() {
        return enseignantRepository.count();
    }
}
