import { ComponentState } from '../../common/types/componentState';

/**
 * State model for the Home view.
 * Manages page-level flags such as loading and ready states.
 */
export class HomeState extends ComponentState {
  /** Whether the page is currently loading data. */
  public isLoading: boolean = false;
  /** Whether the page has completed its initial load. */
  public isReady: boolean = false;

  /**
   * Initializes the page state asynchronously.
   * Simulates an async load before marking the page as ready.
   */
  public async init(): Promise<void> {
    this.isLoading = true;
    // implement load content here
    this.isLoading = false;
    this.isReady = true;
  }
}
