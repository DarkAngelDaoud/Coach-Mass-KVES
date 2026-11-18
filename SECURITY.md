# Politique de sécurité — Coach-Mass-KVES

© KVES

## Versions prises en charge
Seule la dernière version publiée (voir Plus > À propos dans l'application) reçoit les correctifs de sécurité.

## Signaler une faille
- Dans l'application : Plus > Boîte à avis (le message est chiffré avant l'envoi), type « Problème ».
- Sur GitHub : onglet **Security** du dépôt > **Report a vulnerability** (signalement privé), si l'option est activée.

Merci de ne pas publier la faille avant qu'elle soit corrigée. Précise : la version, l'appareil, et les étapes pour reproduire.

## Ce que l'application fait pour te protéger
- Aucune bibliothèque externe, aucun script ni police chargés depuis Internet, aucune statistique de suivi.
- Tes données restent sur ton téléphone ; seuls les avis que tu envoies toi-même sont transmis, chiffrés (ECDH P-256 + AES-256-GCM).
- Politique de sécurité de contenu (CSP) stricte et nettoyage des données importées depuis une sauvegarde.

## Limites connues
- Les données locales et les fichiers de sauvegarde ne sont pas chiffrés (chiffrement facultatif envisagé).
- L'identité de l'expéditeur d'un avis n'est pas vérifiée.
