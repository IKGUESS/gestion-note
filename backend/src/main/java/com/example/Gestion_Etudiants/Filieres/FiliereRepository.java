package com.example.Gestion_Etudiants.Filieres;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface FiliereRepository extends JpaRepository<Filiere, String> {

	Filiere findFilierByCodeFil(String codeFil);

	@Query("SELECT f FROM Filiere f JOIN f.niveau n WHERE n.codeNiv = :codeNiv")
	List<Filiere> findFilieresByCodeNiveau(@Param("codeNiv") String codeNiv);

	@Query("SELECT f FROM Filiere f JOIN f.responsable r WHERE r.cin = :cin")
	List<Filiere> findFilieresByCINResponsable(@Param("cin") String cin);
}