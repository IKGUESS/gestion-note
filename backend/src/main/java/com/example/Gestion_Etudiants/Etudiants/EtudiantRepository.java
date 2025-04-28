package com.example.Gestion_Etudiants.Etudiants;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface EtudiantRepository extends JpaRepository<Etudiant, String> {

	Etudiant findEtudiantByCin(String cin);

	@Query("SELECT etud FROM Etudiant etud JOIN etud.filiere f WHERE f.codeFil = :codeFil")
	List<Etudiant> findEtudiantByCodeFil(@Param("codeFil") String codeFil);

	@Modifying
	@Query("UPDATE Etudiant e SET e.statut = 'Terminer' WHERE e.cin = :cin")
	void updateStatutByCin(@Param("cin") String cin);
}