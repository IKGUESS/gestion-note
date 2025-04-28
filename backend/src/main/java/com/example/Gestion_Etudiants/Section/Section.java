package com.example.Gestion_Etudiants.Section;

import jakarta.persistence.*;
import java.util.Collection;
import com.example.Gestion_Etudiants.SectionFiliere.SectionFilier;

@Entity
@Table(name = "Section")
public class Section {

    @Id
    private String codeSec;
    private String designation;

    @OneToMany(mappedBy = "section")
    private Collection<SectionFilier> sectionfilier;

    // Constructeurs
    public Section() {}

    public Section(String codeSec, String designation) {
        this.codeSec = codeSec;
        this.designation = designation;
    }

    // Getters et Setters
    public String getCodeSec() { return codeSec; }
    public void setCodeSec(String codeSec) { this.codeSec = codeSec; }
    public String getDesignation() { return designation; }
    public void setDesignation(String designation) { this.designation = designation; }
    public Collection<SectionFilier> getSectionfilier() { return sectionfilier; }
    public void setSectionfilier(Collection<SectionFilier> sectionfilier) {
        this.sectionfilier = sectionfilier;
    }
}