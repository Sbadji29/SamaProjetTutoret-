package com.m2GDIL.backend_uniprojet.utilisateur;

import com.m2GDIL.backend_uniprojet.utilisateur.dto.ConnexionReponse;
import com.m2GDIL.backend_uniprojet.utilisateur.dto.ConnexionRequete;
import com.m2GDIL.backend_uniprojet.utilisateur.dto.InscriptionRequete;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/utilisateurs")
public class UtilisateurController {

    private final UtilisateurService utilisateurService;

    public UtilisateurController(UtilisateurService utilisateurService) {
        this.utilisateurService = utilisateurService;
    }

    @PostMapping("/connexion")
    public ConnexionReponse connexion(@Valid @RequestBody ConnexionRequete requete) {
        return utilisateurService.authentifier(requete.getEmail(), requete.getMotDePasse());
    }

    @PostMapping("/inscription")
    @ResponseStatus(HttpStatus.CREATED)
    public ConnexionReponse inscrire(@Valid @RequestBody InscriptionRequete requete) {
        return utilisateurService.inscrire(requete);
    }

    @PostMapping
    public Utilisateur creer(@Valid @RequestBody Utilisateur utilisateur) {
        return utilisateurService.creer(utilisateur);
    }

    @GetMapping
    public List<Utilisateur> obtenirTous() {
        return utilisateurService.obtenirTous();
    }

    @GetMapping("/{id}")
    public Utilisateur obtenirParId(@PathVariable Long id) {
        return utilisateurService.obtenirParId(id);
    }

    @GetMapping("/email")
    public Utilisateur obtenirParEmail(@RequestParam String valeur) {
        return utilisateurService.obtenirParEmail(valeur);
    }

    @GetMapping("/recherche")
    public List<Utilisateur> rechercher(@RequestParam String valeur) {
        return utilisateurService.rechercher(valeur);
    }

    @GetMapping("/etat")
    public List<Utilisateur> obtenirParEtat(@RequestParam Boolean actif) {
        return utilisateurService.obtenirParEtat(actif);
    }

    @PutMapping("/{id}")
    public Utilisateur modifier(@PathVariable Long id, @RequestBody Utilisateur donnees) {
        return utilisateurService.modifier(id, donnees);
    }

    @PatchMapping("/{id}/mot-de-passe")
    public Map<String, String> changerMotDePasse(
            @PathVariable Long id,
            @RequestBody Map<String, String> donnees) {
        utilisateurService.changerMotDePasse(id, donnees.get("nouveauMotDePasse"));
        return Map.of("message", "Mot de passe modifie avec succes.");
    }

    @PatchMapping("/{id}/activer")
    public Utilisateur activer(@PathVariable Long id) {
        return utilisateurService.activer(id);
    }

    @PatchMapping("/{id}/desactiver")
    public Utilisateur desactiver(@PathVariable Long id) {
        return utilisateurService.desactiver(id);
    }

    @GetMapping("/statistiques/nombre")
    public Map<String, Long> compter() {
        return Map.of("nombreUtilisateurs", utilisateurService.compter());
    }

    @GetMapping("/{id}/existe")
    public Map<String, Boolean> existe(@PathVariable Long id) {
        return Map.of("existe", utilisateurService.existe(id));
    }
}
