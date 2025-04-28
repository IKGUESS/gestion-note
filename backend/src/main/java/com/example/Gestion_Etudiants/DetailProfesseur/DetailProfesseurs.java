package com.example.Gestion_Etudiants.DetailProfesseur;

import com.example.Gestion_Etudiants.Professeurs.Professeur;
import jakarta.persistence.*;
import com.example.Gestion_Etudiants.Modules.Module;

@Entity
@Table(name = "DetailsProf")
public class DetailProfesseurs {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "professeur_id") // Référence l'ID plutôt que le CIN
    private Professeur professeur;

    @ManyToOne
    @JoinColumn(name = "module_id") // Meilleure pratique: utiliser l'ID
    private Module module;

    private String statut;
    private String section;

    // Getters et Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Professeur getProfesseur() { return professeur; }
    public void setProfesseur(Professeur professeur) { this.professeur = professeur; }
    public Module getModule() { return module; }
    public void setModule(Module module) { this.module = module; }
    public String getStatut() { return statut; }
    public void setStatut(String statut) { this.statut = statut; }
    public String getSection() { return section; }
    public void setSection(String section) { this.section = section; }
}