package com.example.Gestion_Etudiants.Inscriptions;

import jakarta.persistence.*;
import java.sql.Date;
import com.example.Gestion_Etudiants.Filieres.Filiere;

@Entity
@Table(name = "Inscription")
public class Inscription {

    @Id
    private String cin;
    private String nom;
    private String prenom;
    private Date dateNaissance;

    @ManyToOne
    @JoinColumn(name = "codeFil")
    private Filiere filiere;

    // Constructeurs
    public Inscription() {}

    public Inscription(String cin, String nom, String prenom, Date dateNaissance, Filiere filiere) {
        this.cin = cin;
        this.nom = nom;
        this.prenom = prenom;
        this.dateNaissance = dateNaissance;
        this.filiere = filiere;
    }

    // Getters et Setters
    public String getCin() { return cin; }
    public void setCin(String cin) { this.cin = cin; }
    public String getNom() { return nom; }
    public void setNom(String nom) { this.nom = nom; }
    public String getPrenom() { return prenom; }
    public void setPrenom(String prenom) { this.prenom = prenom; }
    public Date getDateNaissance() { return dateNaissance; }
    public void setDateNaissance(Date dateNaissance) { this.dateNaissance = dateNaissance; }
    public Filiere getFiliere() { return filiere; }
    public void setFiliere(Filiere filiere) { this.filiere = filiere; }
}