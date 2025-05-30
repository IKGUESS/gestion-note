package com.example.Gestion_Etudiants.NoteRattEtd;

import jakarta.persistence.*;
import com.example.Gestion_Etudiants.Etudiants.Etudiant;
import com.example.Gestion_Etudiants.Modules.Module;

@Entity
@Table(name = "NoteRattrapage",
        uniqueConstraints = @UniqueConstraint(columnNames = {"cin", "codeMod"}))
public class noteRattEtd {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id_note;

    @ManyToOne
    @JoinColumn(name = "cin", referencedColumnName = "cin")
    private Etudiant etudiant;

    @ManyToOne
    @JoinColumn(name = "codeMod", referencedColumnName = "codeMod")
    private Module module;

    private double ctrl_1;
    private double ctrl_2;
    private double ctrl_3;
    private double tp_1;
    private double tp_2;
    private double tp_3;
    private double exam_1;
    private double exam_2;
    private double exam_3;
    private String session = "Rattrapage";
    private double moyenne;
    private String resultat;
    private boolean etudiantDansNoteRattrapage = false;

    // Getters et Setters
    public Long getId_note() { return id_note; }
    public void setId_note(Long id_note) { this.id_note = id_note; }
    public Etudiant getEtudiant() { return etudiant; }
    public void setEtudiant(Etudiant etudiant) { this.etudiant = etudiant; }
    public Module getModule() { return module; }
    public void setModule(Module module) { this.module = module; }
    public double getCtrl_1() { return ctrl_1; }
    public void setCtrl_1(double ctrl_1) { this.ctrl_1 = ctrl_1; }
    public double getCtrl_2() { return ctrl_2; }
    public void setCtrl_2(double ctrl_2) { this.ctrl_2 = ctrl_2; }
    public double getCtrl_3() { return ctrl_3; }
    public void setCtrl_3(double ctrl_3) { this.ctrl_3 = ctrl_3; }
    public double getTp_1() { return tp_1; }
    public void setTp_1(double tp_1) { this.tp_1 = tp_1; }
    public double getTp_2() { return tp_2; }
    public void setTp_2(double tp_2) { this.tp_2 = tp_2; }
    public double getTp_3() { return tp_3; }
    public void setTp_3(double tp_3) { this.tp_3 = tp_3; }
    public double getExam_1() { return exam_1; }
    public void setExam_1(double exam_1) { this.exam_1 = exam_1; }
    public double getExam_2() { return exam_2; }
    public void setExam_2(double exam_2) { this.exam_2 = exam_2; }
    public double getExam_3() { return exam_3; }
    public void setExam_3(double exam_3) { this.exam_3 = exam_3; }
    public String getSession() { return session; }
    public void setSession(String session) { this.session = "Rattrapage"; }
    public double getMoyenne() { return moyenne; }
    public void setMoyenne(double moyenne) { this.moyenne = moyenne; }
    public String getResultat() { return resultat; }
    public void setResultat(String resultat) { this.resultat = resultat; }
    public boolean isEtudiantDansNoteRattrapage() { return etudiantDansNoteRattrapage; }
    public void setEtudiantDansNoteRattrapage(boolean etudiantDansNoteRattrapage) {
        this.etudiantDansNoteRattrapage = etudiantDansNoteRattrapage;
    }
}