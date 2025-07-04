import chai from 'chai';

// Extend global types for chai should
declare global {
  namespace NodeJS {
    interface Global {
      should: any;
    }
  }
}

chai.should(); 