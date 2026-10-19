
package com.m2GDIL.backend_uniprojet.utilisateur;

import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/utilisateurs")
public class UtilisateurController {

    private final UtilisateurService utilisateurService;

    public UtilisateurController(
            UtilisateurService utilisateurService) {
        this.utilisateurService = utilisateurService;
    }

    // Creer un utilisateur
    @PostMapping
    public Utilisateur creer(
            @Valid @RequestBody Utilisateur utilisateur) {
        return utilisateurService.creer(utilisateur);
    }

    // Lister les utilisateurs
    @GetMapping
    public List<Utilisateur> obtenirTous() {
        return utilisateurService.obtenirTous();
    }

    // Consulter par identifiant
    @GetMapping("/{id}")
    public Utilisateur obtenirParId(@PathVariable Long id) {
        return utilisateurService.obtenirParId(id);
    }

    // Rechercher par email
    @GetMapping("/email")
    public Utilisateur obtenirParEmail(
            @RequestParam String valeur) {
        return utilisateurService.obtenirParEmail(valeur);
    }

    // Rechercher par nom ou prenom
    @GetMapping("/recherche")
    public List<Utilisateur> rechercher(
            @RequestParam String valeur) {
        return utilisateurService.rechercher(valeur);
    }

    // Filtrer les comptes actifs ou inactifs
    @GetMapping("/etat")
    public List<Utilisateur> obtenirParEtat(
            @RequestParam Boolean actif) {
        return utilisateurService.obtenirParEtat(actif);
    }

    // Modifier les informations generales
    @PutMapping("/{id}")
    public Utilisateur modifier(
            @PathVariable Long id,
            @RequestBody Utilisateur donnees) {
        return utilisateurService.modifier(id, donnees);
    }

    // Changer le mot de passe
    @PatchMapping("/{id}/mot-de-passe")
    public Map<String, String> changerMotDePasse(
            @PathVariable Long id,
            @RequestBody Map<String, String> donnees) {

        utilisateurService.changerMotDePasse(
                id, donnees.get("nouveauMotDePasse"));

        return Map.of(
                "message",
                "Mot de passe modifie avec succes.");
    }

    // Activer un compte
    @PatchMapping("/{id}/activer")
    public Utilisateur activer(@PathVariable Long id) {
        return utilisateurService.activer(id);
    }

    // Desactiver un compte
    @PatchMapping("/{id}/desactiver")
    public Utilisateur desactiver(@PathVariable Long id) {
        return utilisateurService.desactiver(id);
    }

    // Compter les utilisateurs
    @GetMapping("/statistiques/nombre")
    public Map<String, Long> compter() {
        return Map.of(
                "nombreUtilisateurs",
                utilisateurService.compter());
    }

    // Verifier l'existence d'un utilisateur
    @GetMapping("/{id}/existe")
    public Map<String, Boolean> existe(
            @PathVariable Long id) {
        return Map.of(
                "existe",
                utilisateurService.existe(id));
    }
}
