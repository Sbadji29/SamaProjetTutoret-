
package com.m2GDIL.backend_uniprojet.utilisateur;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.crypto.SecretKeyFactory;
import javax.crypto.spec.PBEKeySpec;
import java.security.GeneralSecurityException;
import java.security.SecureRandom;
import java.util.Base64;
import java.util.List;

@Service
public class UtilisateurService {

    private final UtilisateurRepository utilisateurRepository;

    public UtilisateurService(
            UtilisateurRepository utilisateurRepository) {
        this.utilisateurRepository = utilisateurRepository;
    }

    // Hacher le mot de passe avec un sel aleatoire
    private String hacherMotDePasse(String motDePasse) {
        byte[] sel = new byte[16];
        new SecureRandom().nextBytes(sel);

        PBEKeySpec specification = new PBEKeySpec(
                motDePasse.toCharArray(),
                sel,
                210000,
                256
        );

        try {
            SecretKeyFactory fabrique =
                    SecretKeyFactory.getInstance(
                            "PBKDF2WithHmacSHA256");

            byte[] resultat =
                    fabrique.generateSecret(specification)
                            .getEncoded();

            return "PBKDF2$210000$"
                    + Base64.getEncoder().encodeToString(sel)
                    + "$"
                    + Base64.getEncoder()
                            .encodeToString(resultat);

        } catch (GeneralSecurityException e) {
            throw new IllegalStateException(
                    "Impossible de securiser le mot de passe.", e);
        } finally {
            specification.clearPassword();
        }
    }

    // Creer un utilisateur
    @Transactional
    public Utilisateur creer(Utilisateur utilisateur) {

        if (utilisateurRepository.existsByEmailIgnoreCase(
                utilisateur.getEmail())) {
            throw new IllegalArgumentException(
                    "Cette adresse email est deja utilisee.");
        }

        if (utilisateur.getMotDePasse() == null
                || utilisateur.getMotDePasse().length() < 8) {
            throw new IllegalArgumentException(
                    "Le mot de passe doit contenir au moins 8 caracteres.");
        }

        utilisateur.setEmail(utilisateur.getEmail().trim());
        utilisateur.setMotDePasse(
                hacherMotDePasse(utilisateur.getMotDePasse()));
        utilisateur.setActif(true);

        return utilisateurRepository.save(utilisateur);
    }

    // Obtenir tous les utilisateurs
    public List<Utilisateur> obtenirTous() {
        return utilisateurRepository.findAll();
    }

    // Obtenir un utilisateur par ID
    public Utilisateur obtenirParId(Long id) {
        return utilisateurRepository.findById(id)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Utilisateur introuvable : " + id));
    }

    // Rechercher un utilisateur par email
    public Utilisateur obtenirParEmail(String email) {
        return utilisateurRepository.findByEmailIgnoreCase(email)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Utilisateur introuvable pour cet email."));
    }

    // Rechercher par nom ou prenom
    public List<Utilisateur> rechercher(String recherche) {
        return utilisateurRepository
                .findByNomContainingIgnoreCaseOrPrenomContainingIgnoreCase(
                        recherche, recherche);
    }

    // Obtenir les utilisateurs selon leur etat
    public List<Utilisateur> obtenirParEtat(Boolean actif) {
        return utilisateurRepository.findByActif(actif);
    }

    // Modifier le nom, le prenom et l'email
    @Transactional
    public Utilisateur modifier(Long id, Utilisateur donnees) {
        Utilisateur utilisateur = obtenirParId(id);

        if (donnees.getNom() != null
                && !donnees.getNom().isBlank()) {
            utilisateur.setNom(donnees.getNom().trim());
        }

        if (donnees.getPrenom() != null
                && !donnees.getPrenom().isBlank()) {
            utilisateur.setPrenom(donnees.getPrenom().trim());
        }

        if (donnees.getEmail() != null
                && !donnees.getEmail().isBlank()) {

            String nouvelEmail = donnees.getEmail().trim();

            if (!nouvelEmail.equalsIgnoreCase(
                    utilisateur.getEmail())
                    && utilisateurRepository
                    .existsByEmailIgnoreCase(nouvelEmail)) {
                throw new IllegalArgumentException(
                        "Cette adresse email est deja utilisee.");
            }

            utilisateur.setEmail(nouvelEmail);
        }

        return utilisateurRepository.save(utilisateur);
    }

    // Changer le mot de passe
    @Transactional
    public void changerMotDePasse(
            Long id, String nouveauMotDePasse) {

        if (nouveauMotDePasse == null
                || nouveauMotDePasse.length() < 8) {
            throw new IllegalArgumentException(
                    "Le mot de passe doit contenir au moins 8 caracteres.");
        }

        Utilisateur utilisateur = obtenirParId(id);

        utilisateur.setMotDePasse(
                hacherMotDePasse(nouveauMotDePasse));

        utilisateurRepository.save(utilisateur);
    }

    // Activer un compte
    @Transactional
    public Utilisateur activer(Long id) {
        Utilisateur utilisateur = obtenirParId(id);
        utilisateur.setActif(true);
        return utilisateurRepository.save(utilisateur);
    }

    // Desactiver un compte
    @Transactional
    public Utilisateur desactiver(Long id) {
        Utilisateur utilisateur = obtenirParId(id);
        utilisateur.setActif(false);
        return utilisateurRepository.save(utilisateur);
    }

    // Compter les utilisateurs
    public long compter() {
        return utilisateurRepository.count();
    }

    // Verifier l'existence d'un utilisateur
    public boolean existe(Long id) {
        return utilisateurRepository.existsById(id);
    }
}
