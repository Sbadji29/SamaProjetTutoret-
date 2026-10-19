
package com.m2GDIL.backend_uniprojet.responsablepedagogique;

import com.m2GDIL.backend_uniprojet.utilisateur.Utilisateur;
import com.m2GDIL.backend_uniprojet.utilisateur.UtilisateurRepository;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ResponsablePedagogiqueService {

    private final ResponsablePedagogiqueRepository responsableRepository;
    private final UtilisateurRepository utilisateurRepository;

    public ResponsablePedagogiqueService(
            ResponsablePedagogiqueRepository responsableRepository,
            UtilisateurRepository utilisateurRepository) {

        this.responsableRepository = responsableRepository;
        this.utilisateurRepository = utilisateurRepository;
    }

    @Transactional
    public ResponsablePedagogique creer(Long utilisateurId) {

        if (responsableRepository.existsByUtilisateurId(utilisateurId)) {
            throw new IllegalArgumentException(
                "Ce compte possede deja un profil responsable pedagogique.");
        }

        Utilisateur utilisateur = utilisateurRepository
            .findById(utilisateurId)
            .orElseThrow(() -> new IllegalArgumentException(
                "Utilisateur introuvable : " + utilisateurId));

        ResponsablePedagogique responsable =
            new ResponsablePedagogique();

        responsable.setUtilisateur(utilisateur);

        return responsableRepository.save(responsable);
    }

    public List<ResponsablePedagogique> obtenirTous() {
        return responsableRepository.findAll();
    }

    public ResponsablePedagogique obtenirParId(Long id) {
        return responsableRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException(
                "Responsable pedagogique introuvable : " + id));
    }

    public ResponsablePedagogique obtenirParUtilisateur(
            Long utilisateurId) {

        return responsableRepository
            .findByUtilisateurId(utilisateurId)
            .orElseThrow(() -> new IllegalArgumentException(
                "Aucun responsable pedagogique pour cet utilisateur."));
    }

    @Transactional
    public void supprimer(Long id) {
        ResponsablePedagogique responsable = obtenirParId(id);
        responsableRepository.delete(responsable);
    }

    public long compter() {
        return responsableRepository.count();
    }
}
