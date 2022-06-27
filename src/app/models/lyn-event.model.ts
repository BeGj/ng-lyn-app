export interface LynDto {
  Epoch: string; // iso date string
  Point: [number, number];
  CloudIndicator: number;
}

export interface LynDetails extends LynDto {
  // "Epoch":"2022-06-27T13:30:06.448702464Z","Point":[20.5903,68.6687],"CloudIndicator":1,"PeakCurrentEstimate":2,"Multiplicity":0,"SolutionNOfSensors":3,"LocationDegreesOfFreedom":3,"EllipseAngle":60.92,"EllipseSemiMajorAxis":0.4,"EllipseSemiMinorAxis":0.4,"ChiSquare":0.55,"RiseTime":6.8,"PeakToZeroTime":2.4,"MaxRateOfRise":1.3,"AngleIndicator":1,"SignalIndicator":0,"TimingIndicator":1
}


export interface Lyn {
  datetime: Date;
  point: [number, number];
  cloudIndication: boolean;
}

export const lynDtoToLyn = (dto: LynDto): Lyn => ({
  datetime: new Date(dto.Epoch),
  cloudIndication: dto.CloudIndicator === 1,
  point: dto.Point
});

// [{"Epoch":"2022-06-27T12:34:51.212019968Z","Point":[15.4757,65.9788],"CloudIndicator":1}]
