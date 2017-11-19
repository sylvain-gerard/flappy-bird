//--------------------- GLOBAL ---------------------//

// Mon élémént HTML birdy qui contient mon sprite Birdy
var birdy = document.getElementById('birdy');

var stringScore = document.getElementById('score');
var intScore= parseInt(stringScore.textContent);

//--------------------- SPRITE ---------------------//

// L'image de sprite que je vais faire défiler pour donner l'impression d'une animation.
var sprite = document.getElementById('sprite');

// La largeur d'une vignette d'animation
var spriteStepWidth = 92;

// Le nombre de vignette - 1
var spriteSteps     = 2;

// La vignette sur laquelle je commence
var step            = 0;

// Fonction appelée par animateScene()
// Fonction qui permet d'animer. Imaginons dans notre exemple qu'on soit à step = 2
function animateSprite () {

  // Je met le left de mon élément à : (-2 * 92) + 'px' -> -184px
  // On voit donc la 3e vignette.
  sprite.style.left= -step * spriteStepWidth + 'px';

  // Step commence à 0, lorsqu'il arrive à 2, il revient à 0.
  // if ( 2 == 2 ) -> Pour reprendre l'exemple de la marelle : si ciel == ciel, je retourne à terre.
  if (step == spriteSteps) {
    step = 0;
  }

  else {
    // Sinon j'avance de 1
    step++;
  }

}

//---------------- FLY ------------------//

// A la base le birdy tombe. Du coup la variable up est initiée à false;
var up = false;

// Quand je suis en train d'appuyer sur espace la variable up est true
document.onkeydown = function (e) {
  if ( e.keyCode == 32 ) {
    up = true;
  }
}

// Quand je lache espace la variable up redevient false
document.onkeyup = function (e) {
  if ( e.keyCode == 32 ) {
    up = false;
  }
}

// Fonction appelée par animateScene()
// Fonction pour animer le vol
function animateFly () {

  // offsetTop -> valeur en pixel de la position top de mon element html
  var fall = birdy.offsetTop;

  // Si je suis en train d'appuyer sur espace, up == true et donc birdy monte, jusqu'au top.
  if (up == true && fall >= 0) {
    birdy.style.top = (fall - 20) + 'px';
  }
  // Sinon, up == false et donc birdy tombe jusqu'au bas.
  else if( up == false && fall < document.body.offsetHeight-80){
        birdy.style.top = (fall + 12) + 'px';
  }
      
}

//-------------------- PIPES -------------------//

// Pipes sera un tableau avec tout les éléments HTML dont la class est "pipe".
var pipes = document.getElementsByClassName('pipe');

// Tout ces élements font forcément la même width. Du coup j'en choisi un au hasard pour récupérer le width.
var pipeWidth = pipes[0].offsetWidth;

//Fonction appelée par animatePipes()
function updateHeight (upPipe, downPipe) {

   //Pourcentage de mon élément qui fera obstacle
   var obstacle = 70;
   // J'assigne automatiquement 1/3 d'obstacle en haut. Et 1/3 d'obstacle en bas.
   var blockObstacle = obstacle / 3;
   // Pour le troisième 1/3 -> je veux un random entre 0 et son total.
   var random = Math.floor( Math.random() * blockObstacle ); // random
   // Ce random je l'ajoute au 1/3 du haut.
   var upObstacle = blockObstacle + random; // 1/3 + random
   // Ce qui reste du troisième 1/3 je l'ajoute au 1/3 du bas.
   var downObstacle = blockObstacle + (blockObstacle - random); // 1/3 + (1/3 - random)

   upPipe.style.height = upObstacle + '%';
   downPipe.style.height = downObstacle + '%';

}

// Fonction appelée par animatePipes() pour vérifier pour chaque pipe, si il rentre en collision avec Birdy
function touchPipe (pipe) {

  // Je récupère toutes les limites importantes de mon pipe
  var pipeLeft = pipe.offsetLeft;
  var pipeRight = pipe.offsetLeft + pipe.offsetWidth;
  var pipeUp = pipe.children[0].offsetTop+ pipe.children[0].offsetHeight;
  var pipeDown = pipe.children[1].offsetTop;

  // Je récupère toutes les limites importantes de mon birdy
  var birdyRight = birdy.offsetLeft + birdy.offsetWidth;
  var birdyLeft = birdy.offsetLeft;
  var birdyUp = birdy.offsetTop;
  var birdyDown = birdy.offsetHeight + birdy.offsetTop;

  // Si jamais le birdy entre en collision avec un des enfants, up ou down, de mon pipe. Je colore cet enfant en rouge.
  if ( birdyRight > pipeLeft && birdyLeft < pipeRight ) {
    if (birdyDown > pipeDown ) {
      pipe.children[1].style.backgroundColor = 'red';
    }
    if (birdyUp < pipeUp) {
      pipe.children[0].style.backgroundColor = 'red';
    }
  }
}

// Fonction appelée par animateScene() Pour faire défiler chaque pipe vers la gauche.
function animatePipes () {

  // Je récupère une collection HTML, qui est un Array complexe et la raison pour laquelle je dois "hack" la fonction .forEach()
  // Pour chacune des pipes, j'éxecute la fonction ci-dessous, où pipe prendra la valeur de chaque pipe l'une après l'autre.
  Array.prototype.forEach.call( pipes, function (pipe) {

    // Je récupère le left de mon pipe
    var left = pipe.offsetLeft;

    // Et je l'incrémente de 10
    pipe.style.left = left - 10 + 'px';

    // Si left est inférieur à la largeur du pipe -> le pipe a disparu.
    if (left < -pipeWidth) {

      // Du coup je le remet au bout.
      pipe.style.left = 100 + '%';

      // Je re-défini un nouveau random pour le partage de mon obstacle
      updateHeight(pipe.children[0], pipe.children[1]);

      // Je reset les enfants up et down à vert.
      pipe.children[0].style.backgroundColor = 'green';
      pipe.children[1].style.backgroundColor = 'green';
    }

    // Je vérifie si mon pipe entre en collision avec Birdy
    touchPipe (pipe);
  });

}

//--------------------- GLOBAL -----------------//

// Fonction appelée par mon window.setInterval() toutes les 80ms.
function animateScene () {
  // Cette fonction appelle du coup toutes ces fonctions
  animateSprite();
  animateFly();
  animatePipes();
}

//-----------------------------------------------------------
// LAUNCH SCENE
//-----------------------------------------------------------

// window.setInterval(action, ms) -> exécute une action à interval régulier de ms
var animationInstance = window.setInterval(animateScene, 40);