import { Types } from 'mongoose';

interface FoodItem {
  _id: Types.ObjectId;
  name: string;
  calories: number;
  macros: {
    protein: number;
    carbs: number;
    fats: number;
  };
  imageUrl: string;
  similarImages: string[];
  thirdPartyLinks: {
    uberEats?: string;
    deliveroo?: string;
    foodPanda?: string;
  };
}

const foodNames = [
  'Pizza', 'Burger', 'Salad', 'Sushi', 'Pasta', 'Steak', 
  'Sandwich', 'Bowl', 'Curry', 'Soup', 'Wrap', 'Rice Bowl'
];

const foodTypes = [
  'Margherita', 'Caesar', 'California', 'Greek', 'Thai', 
  'Mexican', 'Italian', 'Japanese', 'Indian', 'Mediterranean'
];

class FoodGenerator {
  private static getRandomElement<T>(array: T[]): T {
    return array[Math.floor(Math.random() * array.length)];
  }

  private static getRandomNumber(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  private static generateMacros(calories: number) {
    const protein = this.getRandomNumber(10, 30);
    const fats = this.getRandomNumber(8, 25);
    const carbs = this.getRandomNumber(20, 60);
    
    return { protein, carbs, fats };
  }

  private static generateImages(foodName: string): {main: string, similar: string[]} {
    const baseUrl = 'https://example.com/images';
    const mainImage = `${baseUrl}/${foodName.toLowerCase().replace(' ', '-')}.jpg`;
    const similarImages = Array(3).fill(null).map((_, i) => 
      `${baseUrl}/${foodName.toLowerCase().replace(' ', '-')}-${i + 1}.jpg`
    );

    return { main: mainImage, similar: similarImages };
  }

  private static generateDeliveryLinks(foodName: string) {
    const encodedFood = encodeURIComponent(foodName.toLowerCase());
    return {
      uberEats: `https://ubereats.com/search?q=${encodedFood}`,
      deliveroo: `https://deliveroo.com/menu?q=${encodedFood}`,
      ...(Math.random() > 0.5 && { 
        foodPanda: `https://foodpanda.com/restaurants?q=${encodedFood}` 
      })
    };
  }

  static generateRandomFood(): FoodItem {
    const name = `${this.getRandomElement(foodTypes)} ${this.getRandomElement(foodNames)}`;
    const calories = this.getRandomNumber(200, 800);
    const images = this.generateImages(name);

    return {
      _id: new Types.ObjectId(), // Generate MongoDB-compatible ID
      name,
      calories,
      macros: this.generateMacros(calories),
      imageUrl: images.main,
      similarImages: images.similar,
      thirdPartyLinks: this.generateDeliveryLinks(name)
    };
  }
}

export default FoodGenerator;
