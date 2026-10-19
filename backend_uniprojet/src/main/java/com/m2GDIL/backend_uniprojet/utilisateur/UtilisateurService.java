package com.m2GDIL.backend_uniprojet.utilisateur;

import com.m2GDIL.backend_uniprojet.administrateur.AdministrateurRepository;
import com.m2GDIL.backend_uniprojet.enseignant.EnseignantRepository;
import com.m2GDIL.backend_uniprojet.etudiant.EtudiantRepository;
import com.m2GDIL.backend_uniprojet.responsablepedagogique.ResponsablePedagogiqueRepository;
import com.m2GDIL.backend_uniprojet.utilisateur.dto.ConnexionReponse;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.crypto.SecretKeyFactory;
import javax.crypto.spec.PBEKeySpec;
import java.security.GeneralSecurityException;
import java.security.MessageDigest;
import java.security.SecureRandom;
import java.util.Base64;
import java.util.List;

@Service
public class UtilisateurService {

    private final UtilisateurRepository utilisateurRepository;
    private final EtudiantRepository etudiantRepository;
    private final EnseignantRepository enseignantRepository;
    private final ResponsablePedagogiqueRepository responsableRepository;
    private final AdministrateurRepository administrateurRepository;

    public UtilisateurService(
            UtilisateurRepository utilisateurRepository,
            EtudiantRepository etudiantRepository,
            EnseignantRepository enseignantRepository,
            ResponsablePedagogiqueRepository responsableRepository,
            AdministrateurRepository administrateurRepository) {
        this.utilisateurRepository = utilisateurRepository;
        this.etudiantRepository = etudiantRepository;
        this.enseignantRepository = enseignantRepository;
        this.responsableRepository = responsableRepository;
        this.administrateurRepository = administrateurRepository;
    }

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
            SecretKeyFactory fabrique = SecretKeyFactory.getInstance("PBKDF2WithHmacSHA256");
            byte[] resultat = fabrique.generateSecret(specification).getEncoded();

            return "PBKDF2$210000$"
                    + Base64.getEncoder().encodeToString(sel)
                    + "$"
                    + Base64.getEncoder().encodeToString(resultat);

        } catch (GeneralSecurityException e) {
            throw new IllegalStateException("Impossible de securiser le mot de passe.", e);
        } finally {
            specification.clearPassword();
        }
    }

    public boolean verifierMotDePasse(String motDePasseClair, String motDePasseHache) {
        if (motDePasseClair == null || motDePasseHache == null) {
            return false;
        }
        String[] parties = motDePasseHache.split("\\$");
        if (parties.length != 4 || !parties[0].equals("PBKDF2")) {
            return false;
        }

        try {
            int iterations = Integer.parseInt(parties[1]);
            byte[] sel = Base64.getDecoder().decode(parties[2]);
            byte[] hashAttendu = Base64.getDecoder().decode(parties[3]);

            PBEKeySpec specification = new PBEKeySpec(
                    motDePasseClair.toCharArray(),
                    sel,
                    iterations,
                    hashAttendu.length * 8
            );

            try {
                SecretKeyFactory fabrique = SecretKeyFactory.getInstance("PBKDF2WithHmacSHA256");
                byte[] hashCalcule = fabrique.generateSecret(specification).getEncoded();
                return MessageDigest.isEqual(hashAttendu, hashCalcule);
            } finally {
                specification.clearPassword();
            }
        } catch (Exception e) {
            return false;
        }
    }

    @Transactional
    public ConnexionReponse authentifier(String email, String motDePasse) {
        Utilisateur utilisateur = utilisateurRepository.findByEmailIgnoreCase(email)
                .orElseThrow(() -> new IllegalArgumentException("Email ou mot de passe incorrect."));

        if (!Boolean.TRUE.equals(utilisateur.getActif())) {
            throw new IllegalArgumentException("Ce compte est desactive.");
        }

        if (!verifierMotDePasse(motDePasse, utilisateur.getMotDePasse())) {
            throw new IllegalArgumentException("Email ou mot de passe incorrect.");
        }

        String role = "UTILISATEUR";
        Long profilId = null;

        var etudiantOpt = etudiantRepository.findByUtilisateurId(utilisateur.getId());
        if (etudiantOpt.isPresent()) {
            role = "ETUDIANT";
            profilId = etudiantOpt.get().getId();
        } else {
            var enseignantOpt = enseignantRepository.findByUtilisateurId(utilisateur.getId());
            if (enseignantOpt.isPresent()) {
                role = "ENSEIGNANT";
                profilId = enseignantOpt.get().getId();
            } else {
                var responsableOpt = responsableRepository.findByUtilisateurId(utilisateur.getId());
                if (responsableOpt.isPresent()) {
                    role = "RESPONSABLE";
                    profilId = responsableOpt.get().getId();
                } else {
                    var adminOpt = administrateurRepository.findByUtilisateurId(utilisateur.getId());
                    if (adminOpt.isPresent()) {
                        role = "ADMIN";
                        profilId = adminOpt.get().getId();
                    }
                }
            }
        }

        return new ConnexionReponse(
                utilisateur.getId(),
                utilisateur.getNom(),
                utilisateur.getPrenom(),
                utilisateur.getEmail(),
                role,
                profilId
        );
    }

    @Transactional
    public Utilisateur creer(Utilisateur utilisateur) {
        if (utilisateurRepository.existsByEmailIgnoreCase(utilisateur.getEmail())) {
            throw new IllegalArgumentException("Cette adresse email est deja utilisee.");
        }

        if (utilisateur.getMotDePasse() == null || utilisateur.getMotDePasse().length() < 8) {
            throw new IllegalArgumentException("Le mot de passe doit contenir au moins 8 caracteres.");
        }

        utilisateur.setEmail(utilisateur.getEmail().trim());
        utilisateur.setMotDePasse(hacherMotDePasse(utilisateur.getMotDePasse()));
        utilisateur.setActif(true);

        return utilisateurRepository.save(utilisateur);
    }

    public List<Utilisateur> obtenirTous() {
        return utilisateurRepository.findAll();
    }

    public Utilisateur obtenirParId(Long id) {
        return utilisateurRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Utilisateur introuvable : " + id));
    }

    public Utilisateur obtenirParEmail(String email) {
        return utilisateurRepository.findByEmailIgnoreCase(email)
                .orElseThrow(() -> new IllegalArgumentException("Utilisateur introuvable pour cet email."));
    }

    public List<Utilisateur> rechercher(String recherche) {
        return utilisateurRepository.findByNomContainingIgnoreCaseOrPrenomContainingIgnoreCase(recherche, recherche);
    }

    public List<Utilisateur> obtenirParEtat(Boolean actif) {
        return utilisateurRepository.findByActif(actif);
    }

    @Transactional
    public Utilisateur modifier(Long id, Utilisateur donnees) {
        Utilisateur utilisateur = obtenirParId(id);

        if (donnees.getNom() != null && !donnees.getNom().isBlank()) {
            utilisateur.setNom(donnees.getNom().trim());
        }

        if (donnees.getPrenom() != null && !donnees.getPrenom().isBlank()) {
            utilisateur.setPrenom(donnees.getPrenom().trim());
        }

        if (donnees.getEmail() != null && !donnees.getEmail().isBlank()) {
            String nouvelEmail = donnees.getEmail().trim();
            if (!nouvelEmail.equalsIgnoreCase(utilisateur.getEmail())
                    && utilisateurRepository.existsByEmailIgnoreCase(nouvelEmail)) {
                throw new IllegalArgumentException("Cette adresse email est deja utilisee.");
            }
            utilisateur.setEmail(nouvelEmail);
        }

        return utilisateurRepository.save(utilisateur);
    }

    @Transactional
    public void changerMotDePasse(Long id, String nouveauMotDePasse) {
        if (nouveauMotDePasse == null || nouveauMotDePasse.length() < 8) {
            throw new IllegalArgumentException("Le mot de passe doit contenir au moins 8 caracteres.");
        }

        Utilisateur utilisateur = obtenirParId(id);
        utilisateur.setMotDePasse(hacherMotDePasse(nouveauMotDePasse));
        utilisateurRepository.save(utilisateur);
    }

    @Transactional
    public Utilisateur activer(Long id) {
        Utilisateur utilisateur = obtenirParId(id);
        utilisateur.setActif(true);
        return utilisateurRepository.save(utilisateur);
    }

    @Transactional
    public Utilisateur desactiver(Long id) {
        Utilisateur utilisateur = obtenirParId(id);
        utilisateur.setActif(false);
        return utilisateurRepository.save(utilisateur);
    }

    public long compter() {
        return utilisateurRepository.count();
    }

    public boolean existe(Long id) {
        return utilisateurRepository.existsById(id);
    }
}
