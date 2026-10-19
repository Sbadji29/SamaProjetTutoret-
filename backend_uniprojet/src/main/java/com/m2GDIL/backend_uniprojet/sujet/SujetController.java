
package com.m2GDIL.backend_uniprojet.sujet;

import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/sujets")
public class SujetController {

    private final SujetService sujetService;

    public SujetController(SujetService sujetService) {
        this.sujetService = sujetService;
    }

    @PostMapping
    public Sujet creer(
            @RequestBody Sujet sujet,
            @RequestParam Long enseignantId,
            @RequestParam Long sessionId) {
        return sujetService.creer(sujet, enseignantId, sessionId);
    }

    @GetMapping
    public List<Sujet> obtenirTous() {
        return sujetService.obtenirTous();
    }

    @GetMapping("/{id}")
    public Sujet obtenirParId(@PathVariable Long id) {
        return sujetService.obtenirParId(id);
    }

    @GetMapping("/enseignant/{enseignantId}")
    public List<Sujet> obtenirParEnseignant(
            @PathVariable Long enseignantId) {
        return sujetService.obtenirParEnseignant(enseignantId);
    }

    @GetMapping("/session/{sessionId}")
    public List<Sujet> obtenirParSession(
            @PathVariable Long sessionId) {
        return sujetService.obtenirParSession(sessionId);
    }

    @GetMapping("/disponibilite")
    public List<Sujet> obtenirParDisponibilite(
            @RequestParam Boolean valeur) {
        return sujetService.obtenirParDisponibilite(valeur);
    }

    @GetMapping("/niveau")
    public List<Sujet> obtenirParNiveau(@RequestParam String valeur) {
        return sujetService.obtenirParNiveau(valeur);
    }

    @PutMapping("/{id}")
    public Sujet modifier(
            @PathVariable Long id,
            @RequestBody Sujet donnees) {
        return sujetService.modifier(id, donnees);
    }

    @DeleteMapping("/{id}")
    public Map<String, String> supprimer(@PathVariable Long id) {
        sujetService.supprimer(id);
        return Map.of("message", "Sujet supprime.");
    }

    @GetMapping("/statistiques/nombre")
    public Map<String, Long> compter() {
        return Map.of("nombreSujets", sujetService.compter());
    }
}
