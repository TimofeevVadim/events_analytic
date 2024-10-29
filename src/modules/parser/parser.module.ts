import { Module } from '@nestjs/common';
// import { MongooseModule } from '@nestjs/mongoose';

import { ParserService } from './parser.service';
import { ParserController } from './parser.controller';
// import { HistorySchema } from 'src/models/history.model';
// import { ResultsSchema } from 'src/models/results.model';

@Module({
  // imports: [
  //   // MongooseModule.forFeature([{ name: 'History', schema: HistorySchema }]),
  //   // MongooseModule.forFeature([{ name: 'Results', schema: ResultsSchema }]),
  // ],
  controllers: [ParserController],
  // exports: [MongooseModule], 
  providers: [ParserService]
})
export class ParserModule {}
