
package com.m2GDIL.backend_uniprojet.sessionuniversitaire;

import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/sessions-universitaires")
public class SessionUniversitaireController {

    private final SessionUniversitaireService sessionService;

    public SessionUniversitaireController(
            SessionUniversitaireService sessionService) {
        this.sessionService = sessionService;
    }

    @PostMapping
    public SessionUniversitaire creer(
            @Valid @RequestBody SessionUniversitaire session) {
        return sessionService.creer(session);
    }

    @GetMapping
    public List<SessionUniversitaire> obtenirToutes() {
        return sessionService.obtenirToutes();
    }

    @GetMapping("/{id}")
    public SessionUniversitaire obtenirParId(@PathVariable Long id) {
        return sessionService.obtenirParId(id);
    }

    @GetMapping("/libelle")
    public SessionUniversitaire obtenirParLibelle(
            @RequestParam String valeur) {
        return sessionService.obtenirParLibelle(valeur);
    }

    @GetMapping("/etat")
    public List<SessionUniversitaire> obtenirParEtat(
            @RequestParam Boolean active) {
        return sessionService.obtenirParEtat(active);
    }

    @PutMapping("/{id}")
    public SessionUniversitaire modifier(
            @PathVariable Long id,
            @RequestBody SessionUniversitaire donnees) {
        return sessionService.modifier(id, donnees);
    }

    @DeleteMapping("/{id}")
    public Map<String, String> supprimer(@PathVariable Long id) {
        sessionService.supprimer(id);

        return Map.of(
            "message",
            "Session universitaire supprimee."
        );
    }

    @GetMapping("/statistiques/nombre")
    public Map<String, Long> compter() {
        return Map.of(
            "nombreSessions",
            sessionService.compter()
        );
    }
}
