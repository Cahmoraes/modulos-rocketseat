import { startOfHour } from 'date-fns'
import { injectable, inject } from 'tsyringe'

import Appointment from '../infra/typeorm/entities/Appointment'
import AppError from '@shared/errors/AppError'
import IAppointmentsRepository from '../repositories/IAppointmentsRepository'

interface IRequest {
  date: Date
  provider_id: string
}

@injectable()
class CreateAppointmentService {
  constructor(
    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentsRepository
  ) { }

  public async execute({ date, provider_id }: IRequest): Promise<Appointment> {


    const appoitmentDate = startOfHour(date)

    const findAppointmentInSameDate = await this.appointmentsRepository.findByDate(appoitmentDate)

    if (findAppointmentInSameDate) {
      throw new AppError('This appointment is already booked')
    }

    const appointment = await this.appointmentsRepository.create({
      provider_id,
      date: appoitmentDate
    })

    return appointment
  }
}

export default CreateAppointmentService