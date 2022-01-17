import { Component, OnInit } from '@angular/core';
import { CardData } from './card-data.model';
import { MatDialog } from '@angular/material/dialog';
import { RestartDialogComponent } from './restart-dialog/restart-dialog.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  cardImages = [
    "1rBg5YSi00c",
    "Kv1hYl9LlxU",
    "e0wBK0xJXYQ",
    "frFAJ_695DU",
    "8E31onOcVXg",
    "GTghGzaGTJc",
    "eMw-fVXNpME",
    "K3x9DHtxnRI"
  ];

  cards: CardData[] = [];
  flippedCards: CardData[] = [];
  public intervalId: any;
  matchedCount = 0;
  counter = 60;

  constructor(private dialog: MatDialog) {

  }

  ngOnInit(): void {
      this.setupCards();
  }

  setupCards(): void {
    this.timeCheck();
    this.cards = [];
    this.cardImages.forEach((image) => {
      const cardData: CardData = {
        imageId: image,
        state: 'default'
      };

      this.cards.push({ ...cardData});
      this.cards.push({ ...cardData});
    });

    this.cards = this.shuffleArray(this.cards);
  }

  shuffleArray(anArray: any[]): any[] {
    return anArray.map(a => [Math.random(), a])
      .sort((a, b) => a[0] - b[0])
      .map(a => a[1])
  }

  cardClicked(index: number): void {
    const cardInfo = this.cards[index];

    if (cardInfo.state === 'default' && this.flippedCards.length < 2) {
      cardInfo.state = 'flipped';
      this.flippedCards.push(cardInfo);

      if (this.flippedCards.length > 1) {
        this.checkForCardMatch();
      }

    } else if (cardInfo.state === 'flipped') {
      cardInfo.state = 'default';
      this.flippedCards.pop();
    }
  }

  checkForCardMatch(): void {
    setTimeout(() => {
      const cardOne = this.flippedCards[0];
      const cardTwo = this.flippedCards[1];
      const nextState = cardOne.imageId === cardTwo.imageId ? 'matched' : 'default';

      cardOne.state = cardTwo.state = nextState;

      this.flippedCards = [];

      if (nextState === 'matched') {
        this.matchedCount++;

        if (this.matchedCount === this.cardImages.length) {
          this.restartWindow();
        }
      }
    }, 1000);
  }

  restart(): void {
    this.matchedCount = 0;
    this.setupCards();
  }
  
  timeCheck(): void {
     this.intervalId = setInterval(() => {
      this.counter = this.counter - 1;
      if(this.counter === 0) {
        this.restartWindow();
      }
  }, 1000)}

  restartWindow(): void {
    const dialogRef = this.dialog.open(RestartDialogComponent, {
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(() => {
      this.restart();
    });
    clearInterval(this.intervalId);
    this.counter = 60;
  }
}
