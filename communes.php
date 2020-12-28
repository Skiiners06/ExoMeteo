<?php
    header("Content-Type: text/xml");

try{
    $bdd = new PDO('mysql:host=localhost;dbname=bd_communes;charset=utf8', 'root','Skiiiners');

}
catch (Exception $e) {
    die('Erreur : ' . $e->getMessage());
}

if(isset($_GET['nomCommune'])&& $_GET['nomCommune']!=""){
    $nomCommune = htmlentities($_GET['nomCommune']);

    $nomCommune = $nomCommune.'%';
    //var_dump($nomCommune);

    //$reponse = $bdd->query("SELECT * FROM Communes where nomCommune like'.$nomCommune.' ");
    $req = $bdd->prepare("SELECT DISTINCT nom_commune FROM communes where nom_commune like :nomCommune LIMIT 50");
    $req->bindValue(':nomCommune',$nomCommune);
    $req->execute();

    $fichierXml = "<?xml version='1.0' encoding='UTF-8'?>";
    $fichierXml .="<villes>";


    while ($donnees = $req->fetch()) {
        $fichierXml .='<ville value="'.$donnees['nom_commune'].'"></ville>';
    }

    $fichierXml .="</villes>";

    echo $fichierXml;
}
?>


