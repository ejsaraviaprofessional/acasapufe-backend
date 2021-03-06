import {
  ArgumentMetadata,
  HttpException,
  HttpStatus,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { MainDbService } from 'src/common/main-db/main-db.service';

@Injectable()
export class UserByIdPipe implements PipeTransform {
  private collectionName: string;
  private collectionRef: FirebaseFirestore.CollectionReference<FirebaseFirestore.DocumentData>;

  constructor(private readonly dbService: MainDbService) {
    this.collectionName = this.dbService.collections.users;
    this.collectionRef = this.dbService.getCollection(this.collectionName);
  }
  async transform(
    userId: string,
    metadata: ArgumentMetadata,
  ): Promise<
    FirebaseFirestore.DocumentSnapshot<FirebaseFirestore.DocumentData>
  > {
    const user = await this.collectionRef.doc(userId).get();
    const data = await this.dbService.getDataFromDocument(user);
    if (!user.exists) {
      throw new HttpException(`Customer not found`, HttpStatus.NOT_FOUND);
    }
    return user;
  }
}
